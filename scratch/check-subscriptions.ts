import 'dotenv/config';
import { Client, Environment } from 'square';

const token = process.env.SQUARE_ACCESS_TOKEN;
const client = new Client({
  environment: process.env.SQUARE_ENVIRONMENT === 'production' ? Environment.Production : Environment.Sandbox,
  accessToken: token,
});

async function run() {
  console.log("Checking subscriptions for token...");
  try {
    const response = await client.subscriptionsApi.searchSubscriptions({
      query: {}
    });
    console.log("Subscriptions:", JSON.stringify(response.result.subscriptions || [], null, 2));
  } catch (err: any) {
    console.error("Error listing subscriptions:", err?.message || err);
  }
}

run().catch(console.error);
