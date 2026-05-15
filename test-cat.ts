import 'dotenv/config';
import { getSquareClient } from './src/services/square';
const client = getSquareClient();
async function run() {
  const result = await client.catalogApi.upsertCatalogObject({
    idempotencyKey: 'test-cat-' + Date.now(),
    object: {
      type: 'CATEGORY',
      id: '#test-cat',
      categoryData: { name: 'Test Category' }
    }
  });
  console.log(JSON.stringify(result.result, null, 2));
}
run().catch(console.error);
