import 'dotenv/config';
import { Client, Environment } from 'square';

const token = process.env.SQUARE_ACCESS_TOKEN;
const client = new Client({
  environment: process.env.SQUARE_ENVIRONMENT === 'production' ? Environment.Production : Environment.Sandbox,
  accessToken: token,
});

async function run() {
  const bookingId = "x6d7irdo4pxgzv";
  console.log("Canceling test booking:", bookingId);
  try {
    const response = await client.bookingsApi.cancelBooking(bookingId, {
      bookingVersion: 0
    });
    console.log("Cancelled successfully:", JSON.stringify(response.result.booking, null, 2));
  } catch (err: any) {
    console.error("Error canceling booking:", err?.message || err);
  }
}

run().catch(console.error);
