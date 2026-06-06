import "dotenv/config";
import express from "express";
import { getSquareClient, getSquareLocationId } from "./services/square.ts";
import { randomUUID } from "crypto";
import path from "path";
import multer from "multer";
import nodemailer from "nodemailer";
import { SERVICES, CATEGORIES, VEHICLE_SIZES, SPECIALTY_SIZES, ADD_ONS } from "../shared/data/services.ts";
import { logToSystem, logSquareError, LogLevel } from "./services/errorLogger.ts";

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const getSquareErrorMessage = (error: any, fallback: string) => {
  const detail = error?.errors?.[0]?.detail || error?.result?.errors?.[0]?.detail;
  return detail || error?.message || fallback;
};

const logSquareApiError = (label: string, error: any) => {
  const details = {
    statusCode: error?.statusCode,
    errors: error?.errors || error?.result?.errors,
    message: error?.message,
  };
  console.error(label, details);
};

async function startServer() {
  console.log("Starting server...");
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // BigInt serialization
  app.set('json replacer', (key: string, value: any) =>
    typeof value === 'bigint' ? value.toString() : value
  );

  // Helper to get Square Client from request headers
  const getClientFromReq = (req: express.Request) => {
    const token = req.headers['x-square-access-token'] as string;
    return getSquareClient(token);
  };

  const getLocFromReq = (req: express.Request) => {
    const loc = req.headers['x-square-location-id'] as string;
    return getSquareLocationId(loc);
  };

  // API Routes
  app.get("/api/admin/force-migrate", async (req, res) => {
    try {
      res.json({ status: "ok", count: 0, message: "Disabled as Firestore is no longer used for backend service syncing." });
    } catch (e: any) {
      res.status(500).json({ status: "error", error: e.message });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // SEO Routes
  app.get("/robots.txt", (req, res) => {
    const appUrl = process.env.APP_URL || `https://${req.get('host')}`;
    res.type("text/plain");
    res.send(`User-agent: *\nAllow: /\nSitemap: ${appUrl}/sitemap.xml`);
  });

  app.get("/sitemap.xml", (req, res) => {
    const appUrl = process.env.APP_URL || `https://${req.get('host')}`;
    const categories = [
      'full-detailing', 
      'maintenance', 
      'interior-only', 
      'exterior-only', 
      'paint-correction', 
      'ceramic-coating', 
      'rv-motorhome'
    ];
    
    res.type("application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${appUrl}/</loc><priority>1.0</priority></url>
  <url><loc>${appUrl}/services</loc><priority>0.8</priority></url>
  ${categories.map(slug => `<url><loc>${appUrl}/services/${slug}</loc><priority>0.7</priority></url>`).join('\n  ')}
  <url><loc>${appUrl}/gallery</loc><priority>0.7</priority></url>
  <url><loc>${appUrl}/membership</loc><priority>0.6</priority></url>
  <url><loc>${appUrl}/faq</loc><priority>0.5</priority></url>
  <url><loc>${appUrl}/quote</loc><priority>0.7</priority></url>
</urlset>`);
  });

  // Square Payment Processing
  app.post("/api/payments", async (req, res) => {
    const { sourceId, amount, customerId, bookingId, paymentIntentId } = req.body;

    try {
      const client = getClientFromReq(req) as any;

      // Stage 1: Create "Payment Intent" (Square Order) if no sourceId provided
      if (!sourceId) {
        console.log(`💳 Creating Payment Intent for Customer: ${customerId}, Amount: ${amount}`);
        const orderResponse = await client.orders.create({
          idempotencyKey: randomUUID(),
          order: {
            locationId: getLocFromReq(req),
            customerId,
            lineItems: [
              {
                name: `Deposit for Booking ${bookingId || 'New'}`,
                quantity: '1',
                basePriceMoney: {
                  amount: BigInt(amount),
                  currency: 'USD',
                },
              },
            ],
          },
        });

        // Return the Order ID as the "client_secret"
        return res.json({ 
          client_secret: orderResponse.order.id,
          id: orderResponse.order.id
        });
      }

      // Stage 2: Process the actual payment
      const response = await client.payments.create({
        sourceId,
        idempotencyKey: randomUUID(),
        amountMoney: {
          amount: BigInt(amount), // Amount in cents
          currency: 'USD',
        },
        customerId,
        orderId: paymentIntentId, // Link the payment to the "intent" (Order)
        note: `Payment for Booking ${bookingId}${paymentIntentId ? ` (Order: ${paymentIntentId})` : ''}`,
      });

      res.json(response.payment);
    } catch (error: any) {
      console.error("Square Payment Error:", error);
      res.status(500).json({ error: error.message || "Payment failed" });
    }
  });

  // Fetch Services from Square Catalog
  app.get("/api/catalog/debug", async (req, res) => {
    try {
      const client = getClientFromReq(req) as any;
      const catalog = client.catalogApi;
      
      let objects: any[] = [];
      let cursor: string | undefined = undefined;
      
      do {
        const response: any = await catalog.listCatalog(cursor, 'ITEM');
        const resObjects = response.data || response.result?.objects || response.objects || [];
        objects = objects.concat(resObjects);
        cursor = response.response?.cursor || response.result?.cursor || response.cursor;
      } while (cursor);

      res.json(objects);
    } catch (e: any) {
      res.status(500).json({ error: e.message || String(e) });
    }
  });

  app.get("/api/catalog/services", async (req, res) => {
    try {
      const client = getClientFromReq(req) as any;
      const catalog = client.catalogApi;
      
      let objects: any[] = [];
      let cursor: string | undefined = undefined;
      
      do {
        const response: any = await catalog.listCatalog(cursor, 'ITEM');
        const resObjects = response.data || response.result?.objects || response.objects || [];
        objects = objects.concat(resObjects);
        cursor = response.response?.cursor || response.result?.cursor || response.cursor;
      } while (cursor);

      // Filter for items that are services and map them
      const serviceMap = new Map();
      
      objects
        .filter((obj: any) => obj.itemData?.variations?.some((v: any) => v.itemVariationData?.serviceDuration))
        .forEach((obj: any) => {
          const name = obj.itemData?.name;
          const version = obj.version ? BigInt(obj.version) : 0n;
          
          if (!serviceMap.has(name) || version > serviceMap.get(name).version) {
            serviceMap.set(name, {
              id: obj.id,
              name: obj.itemData?.name,
              description: obj.itemData?.description,
              categoryId: obj.itemData?.categoryId,
              version: version,
              variations: obj.itemData?.variations?.map((v: any) => ({
                id: v.id,
                name: v.itemVariationData?.name,
                duration: v.itemVariationData?.serviceDuration,
                price: v.itemVariationData?.priceMoney?.amount ? Number(v.itemVariationData.priceMoney.amount) / 100 : 0,
              }))
            });
          }
        });

      res.json(Array.from(serviceMap.values()));
    } catch (error: any) {
      console.error("Square Catalog Error:", error);
      res.json([]);
    }
  });

  // ─── Square Catalog Sync ───────────────────────────────────────────────────
  // POST /api/admin/sync-catalog
  // Upserts all services from services.ts into Square as bookable service items.
  // Safe to run multiple times — will NEVER create duplicates.
  // ────────────────────────────────────────────────────────────────────────────
  app.post('/api/admin/sync-catalog', async (req, res) => {
    const results: { name: string; action: 'created' | 'updated' | 'skipped'; id?: string; error?: string }[] = [];

    try {
      const client = getClientFromReq(req) as any;
      const locationId = getLocFromReq(req);

      // ── Step 1: Fetch all existing Square catalog items ───────────────────
      let existingObjects: any[] = [];
      let cursor: string | undefined;
      do {
        const resp: any = await client.catalogApi.listCatalog(cursor, 'ITEM');
        const objs = resp.data || resp.result?.objects || resp.objects || [];
        existingObjects = existingObjects.concat(objs);
        cursor = resp.response?.cursor || resp.result?.cursor || resp.cursor;
      } while (cursor);

      // Build name → existing item map (latest version wins)
      const existingByName = new Map<string, any>();
      for (const obj of existingObjects) {
        const name: string = obj.itemData?.name || '';
        const version = obj.version ? BigInt(obj.version) : 0n;
        const prev = existingByName.get(name);
        if (!prev || version > BigInt(prev.version || 0)) {
          existingByName.set(name, obj);
        }
      }

      // ── Step 2: Fetch team members for bookability ────────────────────────
      let teamMemberId: string | null = null;
      try {
        const teamResp: any = await client.teamApi.searchTeamMembers({ query: {} });
        const members = teamResp.teamMembers || teamResp.result?.teamMembers || [];
        if (members.length > 0) teamMemberId = members[0].id;
      } catch (e) {
        console.warn('Could not fetch team members — bookability will be skipped:', e);
      }

      // ── Step 3: Duration helper ───────────────────────────────────────────
      const durationToMs = (dur: string): number => {
        const match = dur.match(/(\d+(?:\.\d+)?)/);
        const hours = match ? parseFloat(match[1]) : 2;
        return Math.round(hours * 60 * 60 * 1000);
      };

      // ── Step 4: Vehicle size labels ───────────────────────────────────────
      const VEHICLE_LABELS: Record<string, string> = {
        car: 'Car / Sedan',
        suv: 'SUV / Crossover',
        truck: 'Truck',
        largeSuv: 'Large SUV / Van',
        rv: 'RV / Boat (per foot)',
        tractor: 'Tractor / Equipment',
      };

      // ── Step 5: Build & upsert each service ───────────────────────────────
      for (const svc of SERVICES) {
        const squareName = svc.squareName || svc.name;

        try {
          const existing = existingByName.get(squareName);
          const durationMs = durationToMs(svc.duration || '2 hours');
          const priceObj = svc.price as Record<string, number>;

          // Build variations (one per vehicle size)
          const variations = Object.entries(priceObj)
            .filter(([, price]) => price > 0) // skip $0 (PPF inquiry)
            .map(([sizeKey, price]) => {
              const label = VEHICLE_LABELS[sizeKey] || sizeKey;
              const variationName = Object.keys(priceObj).length === 1 ? squareName : label;

              // If updating, find the matching existing variation to preserve its ID
              const existingVariation = existing?.itemData?.variations?.find(
                (v: any) => v.itemVariationData?.name === variationName
              );

              return {
                type: 'ITEM_VARIATION',
                id: existingVariation?.id || `#var-${svc.id}-${sizeKey}`,
                ...(existingVariation ? { version: existingVariation.version } : {}),
                itemVariationData: {
                  name: variationName,
                  pricingType: 'FIXED_PRICING',
                  priceMoney: {
                    amount: BigInt(Math.round(price * 100)),
                    currency: 'USD',
                  },
                  serviceDuration: durationMs,
                  availableForBooking: true,
                  // Link to location so it's bookable there
                  locationOverrides: locationId
                    ? [{ locationId, trackInventory: false }]
                    : undefined,
                },
              };
            });

          // For PPF (price = 0), create a single "Contact for Quote" variation
          if (variations.length === 0) {
            variations.push({
              type: 'ITEM_VARIATION',
              id: existing?.itemData?.variations?.[0]?.id || `#var-${svc.id}-quote`,
              ...(existing?.itemData?.variations?.[0] ? { version: existing.itemData.variations[0].version } : {}),
              itemVariationData: {
                name: 'Contact for Quote',
                pricingType: 'VARIABLE_PRICING',
                serviceDuration: durationToMs('2 hours'),
                availableForBooking: false,
              },
            });
          }

          const catalogObject: any = {
            type: 'ITEM',
            id: existing?.id || `#item-${svc.id}`,
            ...(existing ? { version: existing.version } : {}),
            itemData: {
              name: squareName,
              description: svc.shortDescription || svc.longDescription?.slice(0, 4096),
              variations,
              // Mark as a service (not a product)
              productType: 'APPOINTMENTS_SERVICE',
            },
          };

          const upsertResp: any = await client.catalogApi.upsertCatalogObject({
            idempotencyKey: randomUUID(),
            object: catalogObject,
          });

          const savedItem = upsertResp.catalogObject || upsertResp.result?.catalogObject;
          const savedId = savedItem?.id;

          // ── Step 6: Enable service for team member bookings ───────────────
          if (teamMemberId && savedId) {
            try {
              // Bookability is managed via Square Dashboard → Bookings settings.
              // The Square SDK does not expose upsertTeamMemberBookingProfile —
              // team member booking profiles are read-only via the API.
              console.log(`✅ Synced "${squareName}" (ID: ${savedId}). Enable bookability in Square Dashboard.`);
            } catch (bookErr: any) {
              console.warn(`Bookings note for "${squareName}":`, bookErr?.message || bookErr);
            }
          }


          results.push({
            name: squareName,
            action: existing ? 'updated' : 'created',
            id: savedId,
          });
        } catch (err: any) {
          console.error(`Sync error for "${squareName}":`, err);
          results.push({ name: squareName, action: 'skipped', error: err?.message || String(err) });
        }
      }

      const created = results.filter((r) => r.action === 'created').length;
      const updated = results.filter((r) => r.action === 'updated').length;
      const skipped = results.filter((r) => r.action === 'skipped').length;

      res.json({
        status: 'ok',
        summary: { created, updated, skipped, total: results.length },
        results,
      });
    } catch (fatal: any) {
      console.error('Catalog sync fatal error:', fatal);
      res.status(500).json({ status: 'error', error: fatal?.message || String(fatal) });
    }
  });

  // Square Availability API
  app.get("/api/availability", async (req, res) => {
    try {
      const { start, end, serviceVariationId, serviceVariationIds } = req.query;
      
      if (!start || !end) {
        return res.status(400).json({ error: "Start and end dates are required" });
      }

      const client = getClientFromReq(req) as any;
      const ids = serviceVariationIds ? (serviceVariationIds as string).split(',') : [(serviceVariationId as string) || "ANY_SERVICE_VARIATION_ID"];
      
      const response = await client.bookingsApi.searchAvailability({
        query: {
          filter: {
            startAtRange: {
              startAt: start as string,
              endAt: end as string,
            },
            locationId: getLocFromReq(req),
            segmentFilters: ids.map(id => ({
              serviceVariationId: id,
            }))
          }
        }
      });

      const availabilities = response.result?.availabilities || response.availabilities || [];
      res.json(availabilities);
    } catch (error: any) {
      logSquareApiError("Square Availability Error:", error);
      res.status(error.statusCode || 500).json({ error: getSquareErrorMessage(error, "Failed to fetch availability") });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const { startAt, locationId, serviceVariationIds, appointmentSegments, customer, serviceName, addons } = req.body;
      
      const client = getClientFromReq(req) as any;
      const resolvedLocationId = locationId || getLocFromReq(req);

      if (!startAt || !resolvedLocationId || !customer?.email || !customer?.firstName || !customer?.phone) {
        return res.status(400).json({ error: "Missing required booking details." });
      }

      if (!Array.isArray(serviceVariationIds) || serviceVariationIds.length === 0) {
        return res.status(400).json({ error: "A Square service variation is required to create a booking." });
      }

      if (serviceVariationIds.some((id: string) => !id || id.startsWith("local-") || id.includes("-var-"))) {
        return res.status(400).json({ error: "This service is not connected to a real Square service variation. Sync Square services before accepting online bookings." });
      }

      if (!Array.isArray(appointmentSegments) || appointmentSegments.length === 0) {
        return res.status(400).json({ error: "Please choose an available Square time slot before confirming your booking." });
      }

      const bookingSegments = appointmentSegments.map((segment: any) => ({
        durationMinutes: segment.durationMinutes,
        serviceVariationId: segment.serviceVariationId,
        serviceVariationVersion: segment.serviceVariationVersion,
        teamMemberId: segment.teamMemberId,
        anyTeamMember: segment.anyTeamMember,
        intermissionMinutes: segment.intermissionMinutes,
        resourceIds: segment.resourceIds,
      })).map((segment: any) => {
        Object.keys(segment).forEach(key => segment[key] === undefined && delete segment[key]);
        return segment;
      });

      if (bookingSegments.some((segment: any) => !segment.serviceVariationId || !segment.teamMemberId)) {
        return res.status(400).json({ error: "Square did not return a bookable team member for this slot. Please choose another time." });
      }

      // 1. Create or Find Customer
      let customerId;
      try {
        const searchResult = await client.customers.search({
          query: {
            filter: {
              emailAddress: {
                exact: customer.email
              }
            }
          }
        });

        const customers = searchResult.result?.customers || searchResult.customers;
        if (customers && customers.length > 0) {
          customerId = customers[0].id;
        } else {
          const createResult = await client.customers.create({
            idempotencyKey: randomUUID(),
            givenName: customer.firstName,
            familyName: customer.lastName,
            emailAddress: customer.email,
            phoneNumber: customer.phone,
          });
          customerId = createResult.result?.customer?.id || createResult.customer?.id;
        }
      } catch (e: any) {
        console.error("Customer Error:", e);
        throw new Error(e.message || "Square customer creation failed");
      }

      // 2. Create Booking
      const customerNote = [
        customer.notes,
        customer.locationType ? `Service location: ${customer.locationType}` : "",
        customer.address ? `Address: ${customer.address}` : "",
        serviceName ? `Services: ${serviceName}` : "",
        Array.isArray(addons) && addons.length > 0 ? `Add-ons: ${addons.join(", ")}` : "",
      ].filter(Boolean).join("\n");

      const bookingResult = await client.bookingsApi.createBooking({
        idempotencyKey: randomUUID(),
        booking: {
          startAt,
          locationId: resolvedLocationId,
          customerId,
          customerNote,
          appointmentSegments: bookingSegments,
        }
      });
      const booking = bookingResult.result?.booking || bookingResult.booking;

      if (!booking?.id) {
        throw new Error("Square did not return a booking ID.");
      }

      // 3. Send Confirmation Emails
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          const formattedDate = new Date(startAt).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: customer.email,
            subject: "Booking Confirmed - Bryan's Showroom Quality Detailing",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #111;">Booking Confirmed!</h2>
                <p>Hi ${customer.firstName},</p>
                <p>We've received your booking for <strong>${formattedDate}</strong>.</p>
                <p>Payment will be collected upon completion of the service.</p>
                <p><strong>Appointment Details:</strong></p>
                <ul>
                  <li>Location: Bellevue / Omaha Metro</li>
                  <li>Time: ${formattedDate}</li>
                </ul>
                <p>If you have any questions, feel free to call us at (712) 305-6313.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #777;">Bryan's Showroom Quality Detailing</p>
              </div>
            `
          });
        } catch (emailErr) {
          console.error("Email Notification Error:", emailErr);
        }
      }

      res.json(booking);
    } catch (error: any) {
      logSquareApiError("Square Booking Error:", error);
      res.status(error.statusCode || 500).json({ error: getSquareErrorMessage(error, "Failed to create booking") });
    }
  });

  // ─── Review Request Email ──────────────────────────────────────────────────
  // Called after a booking is completed to ask the customer for a Google review
  app.post('/api/send-review-request', async (req, res) => {
    const { firstName, email, serviceName } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const GOOGLE_REVIEW_URL =
      'https://search.google.com/local/writereview?placeid=ChIJVVU5ibSJk4cRCK2ex-dRYIg';

    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `Bryan's Detailing <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `How did we do? — Bryan's Showroom Quality Detailing`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
            <div style="background: #18c972; padding: 32px 40px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 900; color: #000; letter-spacing: -0.04em;">How did we do?</h1>
              <p style="margin: 8px 0 0; color: #000; opacity: 0.7; font-weight: 600;">Bryan's Showroom Quality Detailing</p>
            </div>
            <div style="padding: 40px;">
              <p style="font-size: 16px; color: #e4e4e7; margin: 0 0 16px; line-height: 1.6;">
                Hi ${firstName || 'there'},
              </p>
              <p style="font-size: 16px; color: #e4e4e7; margin: 0 0 24px; line-height: 1.6;">
                I hope you're loving the results of your ${serviceName || 'recent detail'}! If you have 60 seconds, a Google review makes a huge difference for a small local business like mine — and helps other Omaha and Bellevue drivers find quality detailing.
              </p>
              <a href="${GOOGLE_REVIEW_URL}" style="display: inline-block; background: #18c972; color: #000; font-weight: 900; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; padding: 16px 32px; border-radius: 12px;">
                ⭐ Leave a Google Review
              </a>
              <p style="font-size: 13px; color: #71717a; margin: 32px 0 0; line-height: 1.6;">
                Takes less than 60 seconds. Your feedback helps more than you know.<br/>
                — Bryan
              </p>
              <hr style="border: none; border-top: 1px solid #27272a; margin: 32px 0;" />
              <p style="font-size: 11px; color: #52525b; margin: 0;">
                Bryan's Showroom Quality Detailing · 1907 Arlington Cir, Bellevue NE 68123 · (712) 305-6313
              </p>
            </div>
          </div>
        `,
      });

      res.json({ status: 'ok' });
    } catch (err: any) {
      console.error('Review email error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Abandoned Quote Follow-up Email ──────────────────────────────────────
  // Called when a customer starts a quote but doesn't book
  app.post('/api/send-quote-followup', async (req, res) => {
    const { firstName, email, services, vehicleType } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `Bryan's Detailing <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Still thinking about your detail? — Bryan's Showroom Quality Detailing`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
            <div style="background: #111; padding: 32px 40px; border-bottom: 1px solid #1a1a1a;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #fff; letter-spacing: -0.04em;">Still thinking about your detail?</h1>
            </div>
            <div style="padding: 40px;">
              <p style="font-size: 16px; color: #e4e4e7; margin: 0 0 16px; line-height: 1.6;">
                Hi ${firstName || 'there'},
              </p>
              <p style="font-size: 16px; color: #e4e4e7; margin: 0 0 8px; line-height: 1.6;">
                You started a quote for your ${vehicleType || 'vehicle'} — I just wanted to check in. My schedule fills up fast, especially on weekends.
              </p>
              ${services?.length ? `<p style="font-size: 14px; color: #a1a1aa; margin: 0 0 24px;">Services you were interested in: <strong style="color: #fff;">${services.join(', ')}</strong></p>` : ''}
              <a href="https://bryansdetailingomaha.com/book" style="display: inline-block; background: #18c972; color: #000; font-weight: 900; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; padding: 16px 32px; border-radius: 12px;">
                Book My Detail →
              </a>
              <p style="font-size: 13px; color: #71717a; margin: 32px 0 0; line-height: 1.6;">
                Have questions? Reply to this email or call/text me directly at <a href="tel:7123056313" style="color: #18c972;">(712) 305-6313</a>.<br/>
                — Bryan
              </p>
              <hr style="border: none; border-top: 1px solid #27272a; margin: 32px 0;" />
              <p style="font-size: 11px; color: #52525b; margin: 0;">
                Bryan's Showroom Quality Detailing · Bellevue, NE · <a href="https://bryansdetailingomaha.com/unsubscribe" style="color: #52525b;">Unsubscribe</a>
              </p>
            </div>
          </div>
        `,
      });

      res.json({ status: 'ok' });
    } catch (err: any) {
      console.error('Quote follow-up email error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Admin Sync Endpoint - Robust Idempotent Upsert
  app.post("/api/admin/sync-square", async (req, res) => {
    try {

      const client = getClientFromReq(req) as any;
      const { catalog, teamMembers } = client;
      
      console.log('🚀 Starting Square Sync (Idempotent Mode)...');

      // 1. Fetch existing catalog to map names to IDs (prevents duplicates)
      let allObjects: any[] = [];
      let cursor: string | undefined = undefined;
      do {
        const response: any = await catalog.listCatalog(cursor);
        const objects = response.data || response.result?.objects || response.objects || [];
        allObjects = allObjects.concat(objects);
        cursor = response.response?.cursor || response.result?.cursor || response.cursor;
      } while (cursor);
      
      const normalize = (name: string) => {
        return name.toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .trim();
      };
      
      const existingItemsByNorm = new Map<string, any>();
      for (const obj of allObjects) {
        if (obj.isDeleted || obj.type !== 'ITEM') continue;
        existingItemsByNorm.set(normalize(obj.itemData.name), obj);
      }

      // Check for team members for availability
      const teamMemberIds: string[] = [];
      try {
        const teamResult = await teamMembers.search({ query: { filter: { status: 'ACTIVE' } } });
        teamMemberIds.push(...(teamResult.teamMembers?.map((tm: any) => tm.id) || []));
      } catch (e) {
        console.warn("Team member fetch skipped:", e);
      }

      const syncTimestamp = Date.now();

      // Sync categories first
      const categoryIdMap: Record<string, string> = {};
      for (const cat of CATEGORIES) {
        try {
          const catNorm = normalize(cat.name);
          const existingCat = allObjects.find(obj => obj.type === 'CATEGORY' && normalize(obj.categoryData.name) === catNorm);
          
          const upsertRes: any = await catalog.object.upsert({
            idempotencyKey: `cat-${cat.id}-${syncTimestamp}`,
            object: {
              type: 'CATEGORY',
              id: existingCat?.id || `#${cat.id}`,
              version: existingCat?.version,
              categoryData: { name: cat.name },
            }
          });
          const finalId = upsertRes.result?.catalogObject?.id || upsertRes.catalogObject?.id;
          console.log(`Synced category ${cat.name} -> ${finalId}`);
          if (finalId) categoryIdMap[cat.id] = finalId;
        } catch (catError: any) {
          console.error(`Error syncing category ${cat.name}:`, catError);
        }
      }

      let syncedCount = 0;
      const allItems = [...SERVICES, ...ADD_ONS.map(a => ({ ...a, categoryId: 'add-ons', isAddon: true }))];
      const syncedItemIds = new Set<string>();

      for (const item of allItems as any[]) {
        try {
          const norm = normalize(item.name);
          const existing = existingItemsByNorm.get(norm);
          
          // Calculate duration logic
          let durationMinutes = 60;
          if (item.duration) {
            const durStr = typeof item.duration === 'string' ? item.duration : (item.duration.car || Object.values(item.duration)[0]);
            const match = durStr.match(/(\d+)/);
            if (match) {
              durationMinutes = parseInt(match[1]);
              if (durStr.toLowerCase().includes('hour') || durStr.toLowerCase().includes('hr')) {
                durationMinutes *= 60;
              }
            }
          }

          const getVarId = (varName: string, fallback: string) => {
            if (!existing?.itemData?.variations) return fallback;
            const match = existing.itemData.variations.find((v: any) => v.itemVariationData?.name === varName);
            return match ? match.id : fallback;
          };
          
          const getVarVersion = (varName: string) => {
            if (!existing?.itemData?.variations) return undefined;
            const match = existing.itemData.variations.find((v: any) => v.itemVariationData?.name === varName);
            return match ? match.version : undefined;
          };

          const variations = item.isAddon ? [{
            type: 'ITEM_VARIATION',
            id: getVarId('Standard', `#var-${item.id}`),
            version: getVarVersion('Standard'),
            itemVariationData: {
              itemId: existing?.id,
              name: 'Standard',
              pricingType: 'FIXED_PRICING',
              serviceDuration: BigInt(durationMinutes * 60 * 1000),
              availableForBooking: true,
              priceMoney: {
                amount: BigInt(item.price * 100),
                currency: 'USD',
              },
              ...(teamMemberIds.length > 0 ? { teamMemberIds } : {}),
            },
          }] : (item.isSpecialty ? SPECIALTY_SIZES : VEHICLE_SIZES).map(size => {
            const price = item.price[size.id];
            if (price === undefined) return null;
            return {
              type: 'ITEM_VARIATION',
              id: getVarId(size.name, `#var-${item.id}-${size.id}`),
              version: getVarVersion(size.name),
              itemVariationData: {
                itemId: existing?.id,
                name: size.name,
                pricingType: 'FIXED_PRICING',
                serviceDuration: BigInt(durationMinutes * 60 * 1000),
                availableForBooking: true,
                priceMoney: {
                  amount: BigInt(price * 100),
                  currency: 'USD',
                },
                ...(teamMemberIds.length > 0 ? { teamMemberIds } : {}),
              },
            };
          }).filter(Boolean);

          const upsertRes: any = await catalog.object.upsert({
            idempotencyKey: `item-${item.id}-${syncTimestamp}`,
            object: {
              type: 'ITEM',
              id: existing?.id || `#${item.id}`,
              version: existing?.version,
              itemData: {
                name: item.name,
                description: item.longDescription || item.shortDescription || item.description || '',
                categoryId: categoryIdMap[item.categoryId],
                productType: 'APPOINTMENTS_SERVICE',
                variations: variations as any,
              },
            },
          });

          const finalId = upsertRes.result?.catalogObject?.id || upsertRes.catalogObject?.id;
          console.log(`Synced item ${item.name} -> ${finalId}`);
          if (finalId) syncedItemIds.add(finalId);
          syncedCount++;
        } catch (itemError: any) {
           console.error(`Error syncing item ${item.name}:`, itemError.message || itemError);
        }
      }

      // 4. PRUNING: Delete items in Square that are NOT in our local synced set
      const toDeleteIds: string[] = [];
      for (const obj of allObjects) {
        if (obj.type === 'ITEM' && !obj.isDeleted && !syncedItemIds.has(obj.id)) {
          // Extra safety: only delete if it looks like a detailing service or category match
          // (Actually, user explicitly asked to delete what doesn't match the website)
          toDeleteIds.push(obj.id);
        }
      }

      if (toDeleteIds.length > 0) {
        console.log(`🗑️ Pruning ${toDeleteIds.length} extra items from Square...`);
        // Use batchDelete (limit 200 per call, we probably have less)
        await catalog.batchDelete({ objectIds: toDeleteIds });
      }

      // 5. Removed Firestore Master Sync. Local codebase is the only source.
      let masterSyncMsg = "";

      res.json({ 
        success: true, 
        message: `Sync & Prune Complete. Updated ${syncedCount} items, Removed ${toDeleteIds.length} extras.${masterSyncMsg}` 
      });
      
      await logToSystem({
        level: LogLevel.INFO,
        source: 'SquareSync',
        message: 'Manual Square Sync completed successfully',
        details: { syncedCount, prunedCount: toDeleteIds.length, masterSyncMsg }
      });
    } catch (error: any) {
      console.error("Sync Error:", error);
      await logSquareError('SquareSync', 'Manual Square Sync failed', error);
      res.status(500).json({ 
        error: "Square Synchronization failed. Please check your Access Token and Location ID in the Setup Wizard.",
        details: error.message 
      });
    }
  });
  app.post("/api/admin/remove-all-duplicates", async (req, res) => {
    try {
      const client = getClientFromReq(req) as any;
      const { catalog } = client;
      console.log('🧹 Nuclear Cleanup: Identifying all duplicates...');

      let allObjects: any[] = [];
      let cursor: string | undefined = undefined;
      do {
        const response: any = await catalog.listCatalog(cursor, 'CATEGORY,ITEM');
        const objects = response.data || response.result?.objects || response.objects || [];
        allObjects = allObjects.concat(objects);
        cursor = response.response?.cursor || response.result?.cursor || response.cursor;
      } while (cursor);
      
      const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      const itemGroups = new Map<string, any[]>();
      const catGroups = new Map<string, any[]>();

      for (const obj of allObjects) {
        if (obj.isDeleted) continue;
        const name = (obj.type === 'CATEGORY' ? obj.categoryData?.name : obj.itemData?.name || "");
        if (!name) continue;
        const norm = normalize(name);

        const group = obj.type === 'CATEGORY' ? catGroups : itemGroups;
        if (!group.has(norm)) group.set(norm, []);
        group.get(norm)!.push(obj);
      }

      const toDelete: string[] = [];
      
      // Process items
      for (const [name, items] of itemGroups.entries()) {
        if (items.length > 1) {
          items.sort((a,b) => Number((BigInt(b.version || 0) - BigInt(a.version || 0)).toString()));
          const redundant = items.slice(1).map(i => i.id);
          toDelete.push(...redundant);
        }
      }
      
      for (const [name, cats] of catGroups.entries()) {
        if (cats.length > 1) {
          cats.sort((a,b) => Number((BigInt(b.version || 0) - BigInt(a.version || 0)).toString()));
          const redundant = cats.slice(1).map(c => c.id);
          toDelete.push(...redundant);
        }
      }

      if (toDelete.length > 0) {
        const uniqueDels = [...new Set(toDelete)];
        for (let i = 0; i < uniqueDels.length; i += 200) {
          await catalog.batchDelete({ objectIds: uniqueDels.slice(i, i + 200) });
        }
        res.json({ success: true, message: `Cleanup Successful. Merged ${uniqueDels.length} duplicates.` });
      } else {
        res.json({ success: true, message: "No duplicates found." });
      }
    } catch (error: any) {
      console.error("Cleanup Error:", error);
      res.status(500).json({ error: error.message || "Cleanup failed" });
    }
  });

  // --- NEW MASTER SERVICE CRUD ---

  // List all services from Master DB
  app.get("/api/admin/services", async (req, res) => {
    try {
      // Return static services since we removed Firestore Admin duties
      res.json(SERVICES);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Square Webhook Concierge
  app.post("/api/square/webhook", async (req, res) => {
    const { type, data } = req.body;
    
    // Acknowledgement immediately (Square requirements)
    res.status(200).send("OK");

    if (type === 'catalog.version.updated') {
      console.log('🔔 Square Catalog Change Detected. Server auto-correction is currently disabled.');
    }
  });

  app.post("/api/admin/cleanup-duplicates", async (req, res) => {
    try {
      const client = getClientFromReq(req) as any;
      const { catalog } = client;
      console.log('🧹 Nuclear Catalog Flush...');

      let objects: any[] = [];
      let cursor: string | undefined = undefined;
      do {
        const response: any = await catalog.listCatalog(cursor, 'CATEGORY,ITEM');
        const resObjects = response.data || response.result?.objects || response.objects || [];
        objects = objects.concat(resObjects);
        cursor = response.response?.cursor || response.result?.cursor || response.cursor;
      } while (cursor);
      
      const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      const currentNames = new Set([
        ...SERVICES.map(s => normalize(s.name)),
        ...CATEGORIES.map(c => normalize(c.name)),
        ...ADD_ONS.map(a => normalize(a.name))
      ]);

      const toDelete: string[] = [];
      for (const obj of objects) {
        if (obj.isDeleted) continue;
        const name = normalize((obj.type === 'CATEGORY' ? obj.categoryData?.name : obj.itemData?.name) || "");
        if (!name) continue;
        
        // If it's a detail related but not in our official list, trash it
        if (!currentNames.has(name)) {
          const isRelated = ['detail', 'wash', 'wax', 'ceramic', 'paint', 'interior', 'exterior', 'rv', 'boat'].some(p => name.includes(p));
          if (isRelated) toDelete.push(obj.id);
        }
      }

      if (toDelete.length > 0) {
        for (let i = 0; i < toDelete.length; i += 200) {
          await catalog.batchDelete({ objectIds: toDelete.slice(i, i + 200) });
        }
      }

      res.json({ success: true, message: `Flushed ${toDelete.length} items.` });
    } catch (error: any) {
      console.error("Flush Error:", error);
      res.status(500).json({ error: error.message || "Flush failed" });
    }
  });

  // Instant Quote Endpoint
  app.post("/api/quote", upload.array("photos", 5), async (req, res) => {
    try {
      const { name, email, phone, year, make, model, type, condition, services } = req.body;
      const files = req.files as Express.Multer.File[];

      console.log(`📩 New Quote Request from ${name} (${email})`);

      // Configure email transporter
      // Note: User needs to provide these in Secrets
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const emailContent = `
        <h2>New Instant Quote Request</h2>
        <p><strong>Customer Details:</strong></p>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
          <li>Phone: ${phone}</li>
        </ul>
        <p><strong>Vehicle Details:</strong></p>
        <ul>
          <li>Year: ${year}</li>
          <li>Make: ${make}</li>
          <li>Model: ${model}</li>
          <li>Type: ${type}</li>
          <li>Condition: ${condition}</li>
        </ul>
        <p><strong>Services Requested:</strong></p>
        <p>${Array.isArray(services) ? services.join(', ') : services || 'None specified'}</p>
        <p><em>Disclaimer: This is an estimate. Final price may vary upon physical inspection.</em></p>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Quote Request: ${name} - ${year} ${make} ${model}`,
        html: emailContent,
        attachments: files?.map(file => ({
          filename: file.originalname,
          content: file.buffer
        }))
      };

      // Only attempt to send if credentials are provided
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Quote request sent successfully" });
      } else {
        console.warn("⚠️ Email credentials missing. Quote received but not sent.");
        res.json({ 
          success: true, 
          message: "Quote received! (Note: Email notification skipped due to missing server configuration)",
          debug: { name, email, vehicle: `${year} ${make} ${model}` }
        });
      }
    } catch (error: any) {
      console.error("Quote Submission Error:", error);
      res.status(500).json({ error: error.message || "Failed to submit quote request" });
    }
  });

  // Google Places Reviews Endpoint
  app.get("/api/reviews", async (req, res) => {
    try {
      let apiKey = req.headers['x-google-maps-api-key'] as string;
      if (!apiKey || apiKey === 'undefined' || apiKey === 'null' || apiKey === '') {
        apiKey = (process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY) as string;
      }

      if (apiKey) {
        apiKey = apiKey.trim();
      }

      let placeId = req.headers['x-google-place-id'] as string;
      if (!placeId || placeId === 'undefined' || placeId === 'null' || placeId === '') {
        placeId = process.env.GOOGLE_PLACE_ID as string;
      }
      
      if (placeId) {
         placeId = placeId.trim();
      } else {
         placeId = 'ChIJVVU5ibSJk4cRCK2ex-dRYIg'; // Fallback to Bryan's Showroom Quality Mobile Detailing
      }

      if (!apiKey || !placeId || placeId === 'undefined' || apiKey === 'undefined' || placeId === 'null' || apiKey === 'null') {
        return res.json({ 
          success: false, 
          message: "Google Maps API Key and Place ID must be configured in Admin Setup Wizard",
          reviews: [] 
        });
      }

      // Use Places API (New) which supports API keys with HTTP Referrer restrictions
      // We pass the origin/referer from the client to the Google API
      const referer = req.get('origin') || req.get('referer') || 'https://bryansdetailingomaha.com';
      
      const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=reviews`, {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'Referer': referer
        }
      });

      const data = await response.json().catch(() => ({}));
      
      if (!response.ok || data.error) {
        const errorData = data.error || {};
        let message = `Google Places API error: ${errorData.status || errorData.code || response.statusText}`;
        console.warn(message, errorData.message || response.status);
        return res.json({ 
          success: false, 
          message: errorData.message || message,
          reviews: [] // Frontend will fall back
        });
      }

      // Map Google reviews to our format
      const reviews = (data.reviews || []).map((review: any, index: number) => ({
        id: index + 1,
        name: review.authorAttribution?.displayName || "Customer",
        role: "Google Review",
        content: review.text?.text || review.originalText?.text || "",
        rating: review.rating || 5,
        image: review.authorAttribution?.photoUri || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.authorAttribution?.displayName || 'Customer')}&background=random`
      }));

      res.json({ success: true, reviews });
    } catch (error: any) {
      console.error("Google Reviews Error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch reviews" });
    }
  });

  // Admin Logs Endpoint
  app.get("/api/admin/logs", async (req, res) => {
    try {
      // Mock logs response since Firestore logs are disabled
      res.json([]);
    } catch (error: any) {
      console.error("Failed to fetch logs:", error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Initializing Vite dev server...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    console.log("Vite dev server initialized.");
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
