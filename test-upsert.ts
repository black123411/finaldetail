import 'dotenv/config';
import { Client, Environment } from 'square';
const client = new Client({
  environment: Environment.Production,
  accessToken: process.env.VITE_SQUARE_API_TOKEN || process.env.SQUARE_ACCESS_TOKEN,
});
async function run() {
  const res = await client.catalogApi.upsertCatalogObject({
    idempotencyKey: 'test-cat-' + Date.now(),
    object: {
      type: 'CATEGORY',
      id: '#test-cat',
      categoryData: { name: 'Test Category' }
    }
  });
  console.log(Object.keys(res));
  console.log(Object.keys(res.result || {}));
}
run().catch(console.error);
