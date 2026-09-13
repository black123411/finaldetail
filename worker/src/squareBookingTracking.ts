export interface SquareBookingTrackingEnv {
  CONTENT_DB: D1Database;
  SQUARE_WEBHOOK_SIGNATURE_KEY?: string;
  SQUARE_WEBHOOK_NOTIFICATION_URL?: string;
  GA4_MEASUREMENT_ID?: string;
  GA4_API_SECRET?: string;
}

const WEBHOOK_PATH = "/api/webhooks/square/bookings";
const textEncoder = new TextEncoder();

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  });
}

function base64Bytes(value: string): Uint8Array {
  const decoded = atob(value);
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

async function verifySquareSignature(
  request: Request,
  rawBody: string,
  env: SquareBookingTrackingEnv,
): Promise<boolean> {
  const signature = request.headers.get("x-square-hmacsha256-signature") || "";
  const signatureKey = env.SQUARE_WEBHOOK_SIGNATURE_KEY?.trim() || "";
  if (!signature || !signatureKey) return false;

  let signatureBytes: Uint8Array;
  try {
    signatureBytes = base64Bytes(signature);
  } catch {
    return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(signatureKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const notificationUrl =
    env.SQUARE_WEBHOOK_NOTIFICATION_URL?.trim() ||
    new URL(WEBHOOK_PATH, request.url).toString();
  const signatureBuffer = signatureBytes.buffer.slice(
    signatureBytes.byteOffset,
    signatureBytes.byteOffset + signatureBytes.byteLength,
  ) as ArrayBuffer;

  return crypto.subtle.verify(
    "HMAC",
    key,
    signatureBuffer,
    textEncoder.encode(`${notificationUrl}${rawBody}`),
  );
}

async function ensureWebhookTable(env: SquareBookingTrackingEnv): Promise<void> {
  await env.CONTENT_DB.prepare(`
    CREATE TABLE IF NOT EXISTS square_webhook_events (
      event_id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      booking_id TEXT NOT NULL DEFAULT '',
      booking_status TEXT NOT NULL DEFAULT '',
      ga4_event_name TEXT NOT NULL DEFAULT '',
      ga4_sent INTEGER NOT NULL DEFAULT 0,
      processing INTEGER NOT NULL DEFAULT 0,
      processing_started_at TEXT,
      received_at TEXT NOT NULL,
      processed_at TEXT
    )
  `).run();

  await env.CONTENT_DB.prepare(`
    CREATE INDEX IF NOT EXISTS idx_square_webhook_events_received
    ON square_webhook_events (received_at DESC)
  `).run();
}

type SquareBooking = {
  id?: string;
  status?: string;
  source?: string;
  start_at?: string;
  location_id?: string;
  appointment_segments?: Array<{
    service_variation_id?: string;
  }>;
};

type SquareBookingWebhook = {
  merchant_id?: string;
  location_id?: string;
  type?: string;
  event_id?: string;
  created_at?: string;
  data?: {
    id?: string;
    object?: {
      booking?: SquareBooking;
    };
  };
};

function analyticsEventName(eventType: string, bookingStatus: string, bookingSource: string): string | null {
  if (eventType === "booking.created") {
    if (bookingSource === "FIRST_PARTY_MERCHANT") return "booking_created_manual";
    if (bookingSource === "API") return "booking_created_api";
    if (bookingSource === "FIRST_PARTY_BUYER" || bookingSource === "THIRD_PARTY_BUYER") {
      return "booking_confirmed";
    }
    return "booking_created_unknown";
  }

  if (eventType !== "booking.updated") return null;

  if (bookingStatus === "NO_SHOW") return "booking_no_show";
  if (
    bookingStatus === "CANCELLED_BY_CUSTOMER" ||
    bookingStatus === "CANCELLED_BY_SELLER" ||
    bookingStatus === "DECLINED"
  ) {
    return "booking_cancelled";
  }

  return null;
}

async function deterministicClientId(seed: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(seed));
  const view = new DataView(digest);
  return `${view.getUint32(0)}.${view.getUint32(4)}`;
}

async function sendGa4Event(
  env: SquareBookingTrackingEnv,
  payload: SquareBookingWebhook,
  booking: SquareBooking,
  eventName: string,
): Promise<void> {
  const measurementId = env.GA4_MEASUREMENT_ID?.trim() || "";
  const apiSecret = env.GA4_API_SECRET?.trim() || "";
  if (!measurementId || !apiSecret) {
    throw new Error("GA4 Measurement Protocol is not configured");
  }

  const bookingId = booking.id || payload.data?.id || payload.event_id || crypto.randomUUID();
  const clientId = await deterministicClientId(`square-booking:${bookingId}`);
  const firstSegment = booking.appointment_segments?.[0];
  const params: Record<string, string | number> = {
    booking_provider: "square",
    event_source: "square_webhook",
    booking_status: booking.status || "UNKNOWN",
    booking_source: booking.source || "UNKNOWN",
    square_booking_id: bookingId.slice(0, 100),
    square_event_id: (payload.event_id || "").slice(0, 100),
  };

  const locationId = booking.location_id || payload.location_id;
  if (locationId) params.square_location_id = locationId.slice(0, 100);
  if (firstSegment?.service_variation_id) {
    params.square_service_variation_id = firstSegment.service_variation_id.slice(0, 100);
  }

  const body: {
    client_id: string;
    timestamp_micros?: number;
    events: Array<{ name: string; params: Record<string, string | number> }>;
  } = {
    client_id: clientId,
    events: [{ name: eventName, params }],
  };

  const eventTime = Date.parse(payload.created_at || "");
  if (Number.isFinite(eventTime)) body.timestamp_micros = Math.trunc(eventTime * 1000);

  const endpoint = new URL("https://www.google-analytics.com/mp/collect");
  endpoint.searchParams.set("measurement_id", measurementId);
  endpoint.searchParams.set("api_secret", apiSecret);

  const response = await fetch(endpoint.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`GA4 Measurement Protocol returned HTTP ${response.status}`);
  }
}

export function squareBookingTrackingStatus(env: SquareBookingTrackingEnv): Response {
  return json({
    status: "ready",
    endpoint: WEBHOOK_PATH,
    measurementId: env.GA4_MEASUREMENT_ID || null,
    configured: {
      squareSignature: Boolean(env.SQUARE_WEBHOOK_SIGNATURE_KEY),
      ga4MeasurementProtocol: Boolean(env.GA4_MEASUREMENT_ID && env.GA4_API_SECRET),
    },
  });
}

export async function handleSquareBookingWebhook(
  request: Request,
  env: SquareBookingTrackingEnv,
): Promise<Response> {
  const rawBody = await request.text();
  if (!(await verifySquareSignature(request, rawBody, env))) {
    return json({ error: "Invalid Square webhook signature" }, 403);
  }

  let payload: SquareBookingWebhook;
  try {
    payload = JSON.parse(rawBody) as SquareBookingWebhook;
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const eventType = payload.type || "";
  if (eventType !== "booking.created" && eventType !== "booking.updated") {
    return json({ ok: true, ignored: true });
  }

  const eventId = payload.event_id || "";
  if (!eventId) return json({ error: "Square event_id is required" }, 400);

  const booking = payload.data?.object?.booking || {};
  const bookingId = booking.id || payload.data?.id || "";
  const bookingStatus = booking.status || "UNKNOWN";
  const bookingSource = booking.source || "UNKNOWN";
  const ga4EventName = analyticsEventName(eventType, bookingStatus, bookingSource) || "";
  const receivedAt = new Date().toISOString();

  await ensureWebhookTable(env);
  await env.CONTENT_DB.prepare(`
    INSERT OR IGNORE INTO square_webhook_events
      (event_id, event_type, booking_id, booking_status, ga4_event_name, ga4_sent, processing, received_at)
    VALUES (?, ?, ?, ?, ?, 0, 0, ?)
  `).bind(eventId, eventType, bookingId, bookingStatus, ga4EventName, receivedAt).run();

  const existing = await env.CONTENT_DB.prepare(
    "SELECT ga4_sent, processing, ga4_event_name FROM square_webhook_events WHERE event_id = ?",
  ).bind(eventId).first<{ ga4_sent: number; processing: number; ga4_event_name: string }>();

  if (existing?.ga4_sent === 1) {
    return json({ ok: true, duplicate: true, event: existing.ga4_event_name || null });
  }

  const staleBefore = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const claim = await env.CONTENT_DB.prepare(`
    UPDATE square_webhook_events
    SET processing = 1, processing_started_at = ?
    WHERE event_id = ?
      AND ga4_sent = 0
      AND (processing = 0 OR processing_started_at IS NULL OR processing_started_at < ?)
  `).bind(receivedAt, eventId, staleBefore).run();

  if ((claim.meta?.changes || 0) === 0) {
    return json({ ok: true, duplicate: true, processing: true, event: ga4EventName || null });
  }

  if (!ga4EventName) {
    await env.CONTENT_DB.prepare(`
      UPDATE square_webhook_events
      SET ga4_sent = 1, processing = 0, processed_at = ?
      WHERE event_id = ?
    `).bind(new Date().toISOString(), eventId).run();
    return json({ ok: true, ignoredUpdate: true });
  }

  try {
    await sendGa4Event(env, payload, booking, ga4EventName);
    await env.CONTENT_DB.prepare(`
      UPDATE square_webhook_events
      SET ga4_sent = 1, processing = 0, processed_at = ?
      WHERE event_id = ?
    `).bind(new Date().toISOString(), eventId).run();

    return json({ ok: true, event: ga4EventName });
  } catch (error) {
    await env.CONTENT_DB.prepare(`
      UPDATE square_webhook_events
      SET processing = 0, processing_started_at = NULL
      WHERE event_id = ?
    `).bind(eventId).run();

    console.error("[Square booking tracking]", error);
    return json({ error: "Booking event could not be forwarded to GA4" }, 502);
  }
}
