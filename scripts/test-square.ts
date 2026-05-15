
import { SquareClient, SquareEnvironment } from 'square';

async function test() {
  const client = new SquareClient({
    token: 'test',
    environment: SquareEnvironment.Sandbox
  });
  
  try {
      const response = await client.catalog.list({ types: 'CATEGORY' });
      console.log('Response type:', typeof response);
      if (response && typeof response === 'object') {
          console.log('Response keys:', Object.keys(response));
          if ((response as any).objects) {
              console.log('objects type:', typeof (response as any).objects);
          }
      }
  } catch (e) {
      console.error('List error:', e);
  }
}

test().catch(console.error);
