import { serve } from 'bun';
import { handleCreateUser, handleDeleteUser, handleGetAllUsers, handleGetUserById, handleUpdateUser } from './utils/userHandlers';
import { dbConnection } from './database/config';



const PORT = 3001;

dbConnection();

serve({
    port: PORT,
    async fetch(request) {
        const { method } = request;
        const { pathname } = new URL(request.url);
        const pahtRegexForId = /^\/api\/posts\/(\d+)$/;

        //GET - route to get a post by id
        if (method === "GET") {
            const math = pathname.match(pahtRegexForId);
            const id = math && math[1]

            if (id) {
                // handle getting a post by ID
                return handleGetUserById(id);
            }
        }

        // GET - route to get all posts
        if (method === 'GET' && pathname === '/api/users') {
            return handleGetAllUsers();
        }

        // POST - route create a post
        if (method === 'POST' && pathname === '/api/users') {
            const newUser = await request.json();
            return handleCreateUser(newUser.username, newUser.email, newUser.password);
        }

        // PATCH - route to edit a post by id
        if (method === "PATCH") {
            const math = pathname.match(pahtRegexForId);
            const id = math && math[1]

            if (id) {
                // handle updating a post by ID
                const editedUser = await request.json();
                return handleUpdateUser(id, editedUser.username, editedUser.email, editedUser.password);
            }
        }


        // DELETE - route a post by id
        if (method === 'DELETE' && pathname === '/api/users') {
            const { id } = await request.json();
            return handleDeleteUser(id);
        }

        return new Response('Not Found', {status: 404});
    },
});

console.log(`Listening on http://localhost:${PORT} ...`);