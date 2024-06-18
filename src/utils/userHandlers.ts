// userHandlers.ts

import UserModel from '../models/User';

const findOne = async (id: string) => {
  try {
    return await UserModel.findById(id);
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
};

export const handleGetAllUsers = async () => {
  try {
    const users = await UserModel.find();
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export const handleGetUserById = async (id: string) => {
  try {
    const user = await findOne(id);
    if (user) {
      return user;
    } else {
      throw { status: 404, message: "User not found" };
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const handleCreateUser = async (username: string, email: string, password: string) => {
  try {
    const newUser = new UserModel({ username, email, password });
    await newUser.save();
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const handleUpdateUser = async (id: string, username: string, email: string, password: string) => {
  try {
    const user = await UserModel.findByIdAndUpdate(id, { username, email, password }, { new: true });
    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

export const handleDeleteUser = async (id: string) => {
  try {
    const user = await findOne(id);
    if (user) {
      await UserModel.findByIdAndDelete(id);
      return user;
    } else {
      throw { status: 404, message: "User not found" };
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
