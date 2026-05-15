import dotenv from 'dotenv';
dotenv.config();

const token = process.env.SQUARE_ACCESS_TOKEN || '';

if (!token) {
  console.log('❌ No token found in environment.');
} else if (token.startsWith('EAAA')) {
  console.log('✅ Token looks like a PRODUCTION token.');
} else if (token.startsWith('sandbox-')) {
  console.log('⚠️ Token is a SANDBOX token. This is why you don\'t see items in your real dashboard!');
} else {
  console.log('❓ Unknown token format.');
}
