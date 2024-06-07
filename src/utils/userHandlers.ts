import type { User } from "../../user.type";
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const UserModel = mongoose.model("User", UserSchema);


export const handleGetAllUsers  = async  () => {
    const users = await UserModel.find({});
    return new Response(JSON.stringify(users), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export const handleGetUserById  = async  (id: string) => {
    const user = await UserModel.findById(id);

    if (!user) {
        return new Response('User not found', {status:404});
    }

    return new Response(
        JSON.stringify(user), {
            headers: { 'Content-Type': 'application/json'},
    });
}

export const handleCreateUser = async  (username: string, email: string, password: string) => {
    const newUser = new UserModel({ username, email, password });

    await newUser.save();

    return new Response(JSON.stringify(newUser), {
        headers: { 'Content-Type': 'application/json' },
        status: 201,
    });
}
export const handleUpdateUser = async (id: string, username: string, email: string, password: string) => {
    const user = await UserModel.findByIdAndUpdate(id, { username, email, password }, { new: true });

    if (!user) {
        return new Response("User Not Found", { status: 404 });
    }

    return new Response("User Updated", { status: 200 });

}

export const handleDeleteUser = async  (id: string) => {
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
        return new Response("User Not Found", { status: 404 });
    }

    return new Response("User Deleted", { status: 200 });
}
