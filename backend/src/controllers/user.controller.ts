import mongoose from "mongoose";
import { Request, Response } from "express";
import User from "../models/user.model";
import { internalError } from "./controllerError";

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
