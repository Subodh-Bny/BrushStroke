import mongoose from "mongoose";
import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import User, { IUser } from "../models/user.model";
import { internalError } from "./controllerError";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    if (users) {
      return res
        .status(200)
        .json({ message: "Users fetched successfully", data: users });
    }
    return res.status(400).json({ message: "Coundnot fetch users" });
  } catch (error: any) {
    internalError("Error in get all users controller", error, res);
  }
};

export const getArtists = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    if (users) {
      const filteredUsers = users.filter((user) => user.role === "ARTIST");
      return res
        .status(200)
        .json({ message: "Artists fetched successfully", data: filteredUsers });
    }
    return res.status(400).json({ message: "Coundnot fetch users" });
  } catch (error: any) {
    internalError("Error in get artists controller", error, res);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updateFields: any = {};

    if (email && email.trim() !== "") {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updateFields.email = email;
    }
    if (role && role.trim() !== "") updateFields.role = role;
    if (username && username.trim() !== "") updateFields.username = username;
    if (password && password.trim() !== "") {
      const salt = await bcryptjs.genSalt(10);
      updateFields.password = await bcryptjs.hash(password, salt);
    }

    console.log(updateFields);
    const user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      message: "Update successful",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (error: any) {
    internalError("Error in updateUser controller", error, res);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (deletedUser) {
      return res.status(200).json({ message: "User deleted successfully." });
    }
    return res.status(404).json({ message: "User not found!" });
  } catch (error: any) {
    internalError("Error in updateUser controller", error, res);
  }
};
