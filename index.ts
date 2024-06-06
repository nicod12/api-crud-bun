import { serve } from 'bun';

const PORT = 3001;

interface Post {
    id: string;
    title: string; 
    content: string;

}

let blogPost: Post[] = [];

const handleGetAllPosts = () => {
    return new Response(
        JSON.stringify(blogPost), {
            headers: { 'Content-Type': 'application/json'},
    });
}

const handleGetPostById = (id: string) => {
    const post = blogPost.find((post) => post.id === id);

    if (!post) {
        return new Response('Post not found', {status:404});
    }

    return new Response(
        JSON.stringify(post), {
            headers: { 'Content-Type': 'application/json'},
    });
}

const handleCreatePost = (title: string, content: string) => {
    const newPost: Post = {
        id: `${blogPost.length}`,
        title,
        content
    }
    blogPost.push(newPost);

    return new Response(JSON.stringify(newPost), {
      headers: {'Content-Type': 'application/json'},
      status: 201,
    });
}

const handleUpdatePost = (id :string, title: string, content: string) => {
    const postIndex = blogPost.findIndex((post) => post.id === id);

    if (postIndex === -1) {
        return new Response("Post Not Found", {status:404});
    }

    blogPost[postIndex] = {
        ...blogPost[postIndex],
        title,
        content,
    };

    return new Response("Post Updated", {status: 200});
}

const handleDeletePost = (id :string) => {
    const postIndex = blogPost.findIndex((post) => post.id === id);

    if (postIndex === -1) {
        return new Response("Post Not Found", {status:404});
    }

    blogPost.splice(postIndex, 1)
    return new Response("Post Deleted", {status: 200});
}


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
                return handleGetPostById(id);
            }
        }

        // GET - route to get all posts
        if (method === 'GET' && pathname === '/api/posts') {
            return handleGetAllPosts();
        }

        // POST - route create a post
        if (method === 'POST' && pathname === '/api/posts') {
            const newPost = await request.json();
            return handleCreatePost(newPost.title, newPost.content);
        }

        // PATCH - route to edit a post by id
        if (method === "PATCH") {
            const math = pathname.match(pahtRegexForId);
            const id = math && math[1]

            if (id) {
                // handle updating a post by ID
                const editedPost = await request.json();
                return handleUpdatePost(id, editedPost.title, editedPost.content);
            }
        }


        // DELETE - route a post by id
        if (method === 'DELETE' && pathname === '/api/posts') {
            const { id } = await request.json();
            return handleDeletePost(id);
        }

        return new Response('Not Found', {status: 404});
    },
});

console.log(`Listening on http://localhost:${PORT} ...`);