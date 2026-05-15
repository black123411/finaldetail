import 'dotenv/config';
import { getSquareClient } from './src/services/square';

async function run() {
  const client = getSquareClient();
  const catalog = (client as any).catalog;

  try {
    const upsertRes: any = await catalog.object.upsert({
      idempotencyKey: `cat-test-${Date.now()}`,
      object: {
        type: 'CATEGORY',
        id: `#test-cat`,
        categoryData: { name: 'Test Category' },
      }
    });
    console.log("Success!", upsertRes);
  } catch (catError: any) {
    console.error("Error syncing category:", catError.message || catError);
    if(catError.errors) console.error(catError.errors);
  }
}

run().catch(console.error);
