
import { Types } from 'mongoose';
import UserModel from '../models/User';

export const handleGetAllUsers = async () => {
    try {
        const users = await UserModel.find();
        return users;
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
};

export const handleGetUserById = async (id:string) => {
    try {
        const user = await UserModel.findById(id);
        return user;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return null;
    }
};

export const handleCreateUser = async (username:string, email:string, password:string) => {
    try {
        const newUser = new UserModel({ username, email, password });
        await newUser.save();
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
};

export const handleUpdateUser = async (id:string, username:string, email:string, password:string) => {
    try {
        const user = await UserModel.findByIdAndUpdate(id, { username, email, password }, { new: true });
        return user;
    } catch (error) {
        console.error('Error updating user:', error);
        return null;
    }
};

export const handleDeleteUser = async (id:string) => {
    try {
        const user = await UserModel.findByIdAndDelete(id);
        return user;
    } catch (error) {
        console.error('Error deleting user:', error);
        return null;
    }
};
s