import 'dotenv/config';
import { Client, Environment } from 'square';

const token = process.env.SQUARE_ACCESS_TOKEN;
const client = new Client({
  environment: process.env.SQUARE_ENVIRONMENT === 'production' ? Environment.Production : Environment.Sandbox,
  accessToken: token,
});

async function run() {
  const merchantResp = await client.merchantsApi.retrieveMerchant('me');
  console.log("Merchant Info:", JSON.stringify(merchantResp.result.merchant, null, 2));
}

run().catch(console.error);
