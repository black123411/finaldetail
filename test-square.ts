import 'dotenv/config';
import { Client, Environment } from 'square';

const token = process.env.SQUARE_ACCESS_TOKEN;
const client = new Client({
  environment: process.env.VITE_SQUARE_ENVIRONMENT === 'sandbox' ? Environment.Sandbox : Environment.Production,
  accessToken: token,
});

async function run() {
  const response = await client.catalogApi.listCatalog(undefined, 'ITEM');
  console.log(JSON.stringify(response.result.objects, null, 2));
}

run().catch(console.error);
