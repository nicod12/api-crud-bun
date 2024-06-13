import { serve } from 'bun';
import { handleCreateUser, handleDeleteUser, handleGetAllUsers, handleGetUserById, handleUpdateUser } from './utils/userHandlers';
import { dbConnection } from './database/config';


   await dbConnection()
    const PORT = 3001;

    // Middleware para manejar CORS
    const handleCors = (request: Request): Response | null => {
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: headers
            });
        }

        return null;
    };

    serve({
        port: PORT,
        async fetch(request: Request): Promise<Response> {
            const { method } = request;
            const { pathname } = new URL(request.url);
            const pathRegexForId = /^\/api\/users\/(\d+)$/;

            // Aplicar middleware de CORS
            const corsResponse = handleCors(request);
            if (corsResponse) return corsResponse;

            // Encabezados para respuestas
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            };

            if (method === 'GET' && pathname === '/api/users') {
                const users = await handleGetAllUsers();
                return new Response(JSON.stringify(users), {
                    status: 200,
                    headers: headers
                });
            }

            if (method === 'GET') {
                const match = pathname.match(pathRegexForId);
                const id = match && match[1];

                if (id) {
                    const user = await handleGetUserById(id);
                    if (user) {
                        return new Response(JSON.stringify(user), {
                            status: 200,
                            headers: headers
                        });
                    } else {
                        return new Response('User not found', {
                            status: 404,
                            headers: headers
                        });
                    }
                }
            }

            if (method === 'POST' && pathname === '/api/users') {
                const newUser = await request.json();
                const user = await handleCreateUser(newUser.username, newUser.email, newUser.password);
                if (user) {
                    return new Response(JSON.stringify(user), {
                        status: 201,
                        headers: headers
                    });
                } else {
                    return new Response('Error creating user', {
                        status: 500,
                        headers: headers
                    });
                }
            }

            if (method === 'PATCH') {
                const match = pathname.match(pathRegexForId);
                const id = match && match[1];

                if (id) {
                    const editedUser = await request.json();
                    const user = await handleUpdateUser(id, editedUser.username, editedUser.email, editedUser.password);
                    if (user) {
                        return new Response(JSON.stringify(user), {
                            status: 200,
                            headers: headers
                        });
                    } else {
                        return new Response('User not found', {
                            status: 404,
                            headers: headers
                        });
                    }
                }
            }

            if (method === 'DELETE') {
                const match = pathname.match(pathRegexForId);
                const id = match && match[1];

                if (id) {
                    const user = await handleDeleteUser(id);
                    if (user) {
                        return new Response('User deleted', {
                            status: 200,
                            headers: headers
                        });
                    } else {
                        return new Response('User not found', {
                            status: 404,
                            headers: headers
                        });
                    }
                }
            }

            // Ruta no encontrada
            return new Response('Not Found', { status: 404, headers: headers });
        },
    });

    console.log(`Listening on http://localhost:${PORT} ...`);

