import { getSquareClient } from './src/services/square';
const client = getSquareClient();
console.log('catalog:', !!(client as any).catalog);
console.log('catalogApi:', !!(client as any).catalogApi);
