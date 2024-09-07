import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import User from "../models/user.model";
import generateTokenAndCookie from "../utils/generateToken";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, confirmPassword, profilePic, role } =
      req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const userProfilePic = `https://avatar.iran.liara.run/username?username=${username}`;

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      profilePic: profilePic || userProfilePic,
    });

    await newUser.save();

    generateTokenAndCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      profilePic: newUser.profilePic,
    });
  } catch (error: any) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
