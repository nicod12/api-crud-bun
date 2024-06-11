
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
};


const UserModel = mongoose.model("User", UserSchema);


export const handleGetAllUsers  = async  () => {
    const users = await UserModel.find({});
    return new Response(JSON.stringify(users), {
        headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS
        }
    });
}

export const handleGetUserById  = async  (id: string) => {
    const user = await UserModel.findById(id);

    if (!user) {
        return new Response('User not found', {
            status: 404,
            headers: {
                ...CORS_HEADERS
            }
        });
    }

    return new Response(
        JSON.stringify(user), {
            headers: { 'Content-Type': 'application/json',
                ...CORS_HEADERS
            },
    });
}

export const handleCreateUser = async  (username: string, email: string, password: string) => {
    const newUser = new UserModel({ username, email, password });

    await newUser.save();

    return new Response(JSON.stringify(newUser), {
        status: 201,
        headers: { 'Content-Type': 'application/json',
            ...CORS_HEADERS
         },
    });
}
export const handleUpdateUser = async (id: string, username: string, email: string, password: string) => {
    const user = await UserModel.findByIdAndUpdate(id, { username, email, password }, { new: true });

    if (!user) {
        return new Response("User Not Found", {
            status: 404,
            headers: { 'Content-Type': 'application/json',
                ...CORS_HEADERS
             },
        });
    }

    return new Response("User Updated", {
        status: 200,
        headers: {
            ...CORS_HEADERS
        }
    });

}

export const handleDeleteUser = async  (id: string) => {
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
        return new Response("User Not Found", {
            status: 404,
            headers: {
                ...CORS_HEADERS
            }
        });
    }

    return new Response("User Deleted", {
        status: 200,
        headers: {
            ...CORS_HEADERS
        }
    });
}
