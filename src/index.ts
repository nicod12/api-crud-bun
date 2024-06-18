import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { dbConnection } from './database/config';
import userRoutes from './routes/userRoutes';


await dbConnection()
const PORT = 3001;
const app = new Elysia()
app.use(cors())
userRoutes(app);
app.listen(PORT);
console.log(`${app.server?.hostname}:${app.server?.port}`);