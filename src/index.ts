import 'dotenv/config';
import 'module-alias/register';
import mainRouter from '@/routes/index';

import App from './app';

const app = new App(new mainRouter(), Number(process.env.PORT));

app.listen();

