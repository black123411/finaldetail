import { SquareClient, SquareEnvironment } from 'square';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.SQUARE_ACCESS_TOKEN;
const env = process.env.SQUARE_ENVIRONMENT || 'sandbox';

const client = new SquareClient({
  token,
  environment: SquareEnvironment.Production, // Forcing production to see real items
});

async function listCatalog() {
  console.log('🔍 Fetching full Square Catalog...');
  try {
    console.log('📡 Searching ALL Square Catalog Objects...');
    const searchResponse = await (client.catalog as any).searchCatalogObjects({
      query: {}, 
    });

    const allObjects = searchResponse.result.objects || [];
    console.log(`\n📊 TOTAL OBJECTS FOUND VIA SEARCH: ${allObjects.length}`);
    
    allObjects.forEach(obj => {
      const name = obj.categoryData?.name || obj.itemData?.name || obj.taxData?.name || obj.modifierListData?.name || 'Unnamed Object';
      console.log(`- [${obj.type}] ${name} (${obj.id})`);
    });

  } catch (error) {
    console.error('❌ Error fetching catalog:', error);
  }
}

listCatalog();
