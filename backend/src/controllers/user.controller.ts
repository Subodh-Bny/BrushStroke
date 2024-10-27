import mongoose from "mongoose";
import { Request, Response } from "express";
import User from "../models/user.model";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    if (users) {
      const filteredUsers = users.filter((user) => user.role !== "ADMIN");
      return res
        .status(200)
        .json({ message: "Users fetched successfully", users: filteredUsers });
    }
    return res.status(400).json({ message: "Coundnot fetch users" });
  } catch (error: any) {
    console.log("Error in get all users controller", error.message);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.messsage });
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
    console.log("Error in get all users controller", error.message);
    return res
      .status(500)
      .json({ messsage: "Internal server error", error: error.messsage });
  }
};
