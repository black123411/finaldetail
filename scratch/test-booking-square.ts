import 'dotenv/config';
import { Client, Environment } from 'square';
import { randomUUID } from 'crypto';

const token = process.env.SQUARE_ACCESS_TOKEN;
const client = new Client({
  environment: process.env.SQUARE_ENVIRONMENT === 'production' ? Environment.Production : Environment.Sandbox,
  accessToken: token,
});

async function run() {
  console.log("Testing customer creation and booking write with variation version...");
  let customerId: string | undefined;
  try {
    // 1. Fetch catalog object to get correct version
    console.log("Fetching variation version...");
    const catalogResp = await client.catalogApi.retrieveCatalogObject("EXPPH76AN5UK7Q27FGR26FPR");
    const variationVersion = catalogResp.result.object?.version;
    console.log("Found variation version:", variationVersion);

    if (!variationVersion) throw new Error("Could not find variation version");

    // 2. Create a test customer
    const customerResp = await client.customersApi.createCustomer({
      idempotencyKey: randomUUID(),
      givenName: "Test",
      familyName: "BookingUser",
      emailAddress: "testbookinguser@gmail.com",
      phoneNumber: "7123056313"
    });
    customerId = customerResp.result.customer?.id;
    console.log("Created test customer with ID:", customerId);

    if (!customerId) throw new Error("Customer creation failed");

    // 3. Try to book
    console.log("Creating booking...");
    const bookingResp = await client.bookingsApi.createBooking({
      idempotencyKey: randomUUID(),
      booking: {
        startAt: "2026-07-05T12:00:00Z",
        locationId: "L30DXARY07J67",
        customerId: customerId,
        appointmentSegments: [
          {
            durationMinutes: 240,
            serviceVariationId: "EXPPH76AN5UK7Q27FGR26FPR",
            teamMemberId: "TMj5Sr67JDP_wy4b",
            serviceVariationVersion: variationVersion
          }
        ]
      }
    });
    console.log("Success! Booking ID:", bookingResp.result.booking?.id);

  } catch (err: any) {
    console.error("Direct Booking Error details:");
    console.error("Status Code:", err?.statusCode);
    console.error("Errors:", JSON.stringify(err?.errors || err?.result?.errors || err, null, 2));
  } finally {
    if (customerId) {
      try {
        await client.customersApi.deleteCustomer(customerId);
        console.log("Cleaned up test customer.");
      } catch (cleanErr) {
        console.error("Failed to clean up customer:", cleanErr);
      }
    }
  }
}

run().catch(console.error);
