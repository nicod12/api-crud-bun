import { serve } from 'bun';
import { handleCreateUser, handleDeleteUser, handleGetAllUsers, handleGetUserById, handleUpdateUser } from './utils/userHandlers';
import mongoose from 'mongoose';



const PORT = 3001;

mongoose.connect("mongodb://localhost:27017/users")


mongoose.connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

serve({
    port: PORT,
    async fetch(request) {
        const { method } = request;
        const { pathname } = new URL(request.url);
        const pathRegexForId = /^\/api\/users\/(\d+)$/;

        if (method === "GET") {
            const match = pathname.match(pathRegexForId);
            const id = match && match[1];
            if (id) {
                return handleGetUserById(id);
            }
        }

        if (method === 'GET' && pathname === '/api/users') {
            return handleGetAllUsers();
        }

        if (method === 'POST' && pathname === '/api/users') {
            const newUser = await request.json();
            return handleCreateUser(newUser.username, newUser.email, newUser.password);
        }

        if (method === "PATCH") {
            const match = pathname.match(pathRegexForId);
            const id = match && match[1];
            if (id) {
                const editedUser = await request.json();
                return handleUpdateUser(id, editedUser.username, editedUser.email, editedUser.password);
            }
        }

        if (method === 'DELETE' && pathname === '/api/users') {
            const { id } = await request.json();
            return handleDeleteUser(id);
        }

        return new Response('Not Found', { status: 404 });
    },
});
console.log(`Listening on http://localhost:${PORT} ...`);