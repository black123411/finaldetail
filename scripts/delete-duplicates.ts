import { SquareClient, SquareEnvironment } from 'square';
import dotenv from 'dotenv';
dotenv.config();

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Production,
});

const normalize = (name: string) => 
  name.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '')
    .trim();

async function cleanupDuplicates() {
  console.log('🔍 Fetching all catalog objects for cleanup...');
  try {
    let allObjects: any[] = [];
    let cursor: string | undefined = undefined;
    
    do {
      const response: any = await client.catalog.list({ cursor });
      const objects = response.result?.objects || response.response?.objects || response.objects || [];
      const nextCursor = response.result?.cursor || response.response?.cursor || response.cursor;
      
      if (objects.length > 0) {
        allObjects = allObjects.concat(objects);
      }
      cursor = nextCursor;
    } while (cursor);

    console.log(`📊 Total objects found: ${allObjects.length}`);

    const itemsByNorm = new Map<string, any[]>();
    const catsByNorm = new Map<string, any[]>();

    allObjects.forEach(obj => {
      if (obj.isDeleted) return;
      
      const name = obj.type === 'CATEGORY' ? obj.categoryData?.name : obj.itemData?.name;
      if (!name) return;

      const norm = normalize(name);
      const map = obj.type === 'CATEGORY' ? catsByNorm : itemsByNorm;
      
      if (!map.has(norm)) map.set(norm, []);
      map.get(norm)!.push(obj);
    });

    const toDelete: string[] = [];

    // Check Items
    for (const [norm, matches] of itemsByNorm.entries()) {
      if (matches.length > 1) {
        console.log(`⚠️ Found ${matches.length} duplicates for item: "${matches[0].itemData.name}" (${norm})`);
        // Sort by version descending (keep freshest)
        matches.sort((a, b) => Number((BigInt(b.version || 0) - BigInt(a.version || 0)).toString()));
        const duplicates = matches.slice(1).map(m => m.id);
        toDelete.push(...duplicates);
      }
    }

    // Check Categories
    for (const [norm, matches] of catsByNorm.entries()) {
      if (matches.length > 1) {
        console.log(`⚠️ Found ${matches.length} duplicates for category: "${matches[0].categoryData.name}" (${norm})`);
        matches.sort((a, b) => Number((BigInt(b.version || 0) - BigInt(a.version || 0)).toString()));
        const duplicates = matches.slice(1).map(m => m.id);
        toDelete.push(...duplicates);
      }
    }

    if (toDelete.length === 0) {
      console.log('✅ No duplicates found.');
      return;
    }

    console.log(`\n🧹 Deleting ${toDelete.length} duplicate objects...`);
    
    // Batch delete in chunks of 50 (Square limit)
    for (let i = 0; i < toDelete.length; i += 50) {
      const batch = toDelete.slice(i, i + 50);
      try {
        await client.catalog.batchDelete({ objectIds: batch });
        console.log(`✅ Deleted batch of ${batch.length}`);
      } catch (e: any) {
        console.error(`❌ Error deleting batch:`, e.errors?.[0]?.detail || e.message);
      }
    }

    console.log('\n✨ Cleanup Complete!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupDuplicates();
