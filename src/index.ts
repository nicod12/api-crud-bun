import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { dbConnection } from './database/config';
import { handleGetAllUsers, handleGetUserById } from './utils/userHandlers';


await dbConnection()
const PORT = 3001;
new Elysia()
.use(cors())
.get('/api/users', () => handleGetAllUsers())



.listen(PORT);

console.log(`Listening on http://localhost:${PORT} ...`);

