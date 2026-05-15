import { SquareClient, SquareEnvironment } from 'square';
import dotenv from 'dotenv';
dotenv.config();

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: (process.env.SQUARE_ENVIRONMENT || 'sandbox') === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
});

async function checkAccount() {
  try {
    const { result } = await (client.merchants as any).retrieveMerchant({ merchantId: 'me' });
    console.log('\n🏢 Square Account Info:');
    console.log(`- Business Name: ${result.merchant.businessName}`);
    console.log(`- Merchant ID: ${result.merchant.id}`);
    console.log(`- Country: ${result.merchant.country}`);
  } catch (error) {
    console.error('❌ Error retrieving merchant:', error);
  }
}

checkAccount();
