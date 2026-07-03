import 'dotenv/config';
import { Client, Environment } from 'square';
import { randomUUID } from 'crypto';

const token = process.env.SQUARE_ACCESS_TOKEN;
const client = new Client({
  environment: process.env.SQUARE_ENVIRONMENT === 'production' ? Environment.Production : Environment.Sandbox,
  accessToken: token,
});

async function run() {
  console.log("Simulating local /api/bookings request...");
  
  const reqBody = {
    startAt: "2026-07-05T13:00:00Z",
    locationId: "L30DXARY07J67",
    serviceVariationIds: ["EXPPH76AN5UK7Q27FGR26FPR"],
    appointmentSegments: [
      {
        durationMinutes: 240,
        serviceVariationId: "EXPPH76AN5UK7Q27FGR26FPR",
        teamMemberId: "TMj5Sr67JDP_wy4b",
        serviceVariationVersion: "1782508356254"
      }
    ],
    customer: {
      firstName: "Test",
      lastName: "LiveUser",
      email: "testlive@test.com",
      phone: "+17123056313", // using a valid US phone number with +1
      locationType: "drop-off"
    },
    serviceName: "Test Service",
    addons: []
  };

  const { startAt, locationId, serviceVariationIds, appointmentSegments, customer, serviceName, addons } = reqBody;

  try {
    const bookingSegments = appointmentSegments.map((segment: any) => ({
      durationMinutes: segment.durationMinutes,
      serviceVariationId: segment.serviceVariationId,
      serviceVariationVersion: segment.serviceVariationVersion ? BigInt(segment.serviceVariationVersion) : undefined,
      teamMemberId: segment.teamMemberId,
      anyTeamMember: segment.anyTeamMember,
      intermissionMinutes: segment.intermissionMinutes,
      resourceIds: segment.resourceIds,
    })).map((segment: any) => {
      Object.keys(segment).forEach(key => segment[key] === undefined && delete segment[key]);
      return segment;
    });

    console.log("Resolved booking segments:", JSON.stringify(bookingSegments, (k, v) => typeof v === 'bigint' ? v.toString() : v, 2));

    // 1. Create or Find Customer
    let customerId;
    console.log("Searching for customer...");
    const searchResult = await client.customersApi.searchCustomers({
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
      console.log("Found existing customer:", customerId);
    } else {
      console.log("Creating new customer...");
      const createResult = await client.customersApi.createCustomer({
        idempotencyKey: randomUUID(),
        givenName: customer.firstName,
        familyName: customer.lastName,
        emailAddress: customer.email,
        phoneNumber: customer.phone,
      });
      customerId = createResult.result?.customer?.id || createResult.customer?.id;
      console.log("Created customer:", customerId);
    }

    // 2. Create Booking
    const customerNote = [
      "Local test booking simulation",
      customer.locationType ? `Service location: ${customer.locationType}` : "",
    ].join("\n");

    console.log("Creating booking on Square...");
    const bookingResult = await client.bookingsApi.createBooking({
      idempotencyKey: randomUUID(),
      booking: {
        startAt,
        locationId: locationId || "L30DXARY07J67",
        customerId,
        customerNote,
        appointmentSegments: bookingSegments,
      }
    });

    const booking = bookingResult.result?.booking || bookingResult.booking;
    console.log("SUCCESS! Booking ID:", booking?.id);

    // Clean up
    console.log("Cleaning up customer...");
    await client.customersApi.deleteCustomer(customerId!);
    console.log("Done.");

  } catch (err: any) {
    console.error("Booking Error details:");
    console.error("Status Code:", err?.statusCode);
    console.error("Errors:", JSON.stringify(err?.errors || err?.result?.errors || err, null, 2));
  }
}

run().catch(console.error);
