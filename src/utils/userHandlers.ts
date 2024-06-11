
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});



const UserModel = mongoose.model("User", UserSchema);



const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    'Access-Control-Allow-Headers': '*',
};


export const handleGetAllUsers = async () => {
    const users = await UserModel.find({});
    return new Response(JSON.stringify(users), {
        status: 200,
        headers: corsHeaders,
    });
}

export const handleGetUserById = async (id: string) => {
    const user = await UserModel.findById(id);

    if (!user) {
        return new Response('User not found', {
            status: 404,
            headers: corsHeaders,
        });
    }

    return new Response(
        JSON.stringify(user), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
}

export const handleCreateUser = async (username: string, email: string, password: string) => {
    const newUser = new UserModel({ username, email, password });

    await newUser.save();

    return new Response(JSON.stringify(newUser), {
        status: 201,
        headers: corsHeaders,
    });
}

export const handleUpdateUser = async (id: string, username: string, email: string, password: string) => {
    const user = await UserModel.findByIdAndUpdate(id, { username, email, password }, { new: true });

    if (!user) {
        return new Response("User Not Found", {
            status: 404,
            headers: corsHeaders,
        });
    }

    return new Response("User Updated", {
        status: 200,
        headers: corsHeaders,
    });
}

export const handleDeleteUser = async (id: string) => {
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
        return new Response("User Not Found", {
            status: 404,
            headers: corsHeaders,
        });
    }

    return new Response("User Deleted", {
        status: 200,
        headers: corsHeaders,
    });
}