import 'dotenv/config';
import { getSquareClient } from './src/services/square';
const client = getSquareClient();
console.log(Object.keys(client));
