import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import * as gello from '@/models/Book'
const app = new App([] , Number(process.env.PORT));

app.listen();