import { SquareClient, SquareEnvironment } from 'square';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.SQUARE_ACCESS_TOKEN;
const env = process.env.SQUARE_ENVIRONMENT || 'sandbox';

if (!token) {
  console.error('❌ SQUARE_ACCESS_TOKEN is not set');
  process.exit(1);
}

const client = new SquareClient({
  token,
  environment: env === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
}) as any;

async function listLocations() {
  try {
    const response = await client.locations.list();
    const locations = response.locations || [];
    console.log('\n📍 Your Square Locations:');
    locations.forEach((loc: any) => {
      console.log(`- ${loc.name} (ID: ${loc.id})`);
    });
    console.log('\nCopy the ID for the location you want to use.');
  } catch (error) {
    console.error('❌ Failed to list locations:', error);
  }
}

listLocations();
