import 'dotenv/config';
import { getSquareClient } from './src/services/square';

async function run() {
  const client = getSquareClient();
  const catalog = (client as any).catalog;

  try {
    const upsertCat: any = await catalog.object.upsert({
      idempotencyKey: `cat-test-${Date.now()}`,
      object: { type: 'CATEGORY', id: `#test-cat`, categoryData: { name: 'Test Category' } }
    });
    const catId = upsertCat.catalogObject.id;
    console.log("Category ID:", catId);
    
    const upsertItem: any = await catalog.object.upsert({
      idempotencyKey: `item-test-${Date.now()}`,
      object: {
        type: 'ITEM',
        id: `#test-item`,
        itemData: {
          name: 'Test Item',
          categoryId: catId,
          productType: 'APPOINTMENTS_SERVICE',
          variations: [{
            type: 'ITEM_VARIATION',
            id: `#var-test`,
            itemVariationData: {
                name: 'Standard',
                pricingType: 'FIXED_PRICING',
                serviceDuration: BigInt(60 * 60 * 1000),
                availableForBooking: true,
                priceMoney: {
                  amount: BigInt(1000),
                  currency: 'USD',
                }
            }
          }]
        }
      }
    });
    console.log("ITEM RESULT:", JSON.stringify(upsertItem.catalogObject.itemData, null, 2));
  } catch (err: any) {
    console.error("Error:", err.message || err);
    if(err.errors) console.error(err.errors);
  }
}

run().catch(console.error);
