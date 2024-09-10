import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { NextFunction, Response, Request } from "express";

interface JwtPayloadWithUserId extends jwt.JwtPayload {
  userId: string;
}

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Uauthorized  - No Token Provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayloadWithUserId;

    if (!decoded) {
      return res.status(401).json({ error: "Uauthorized  - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    //@ts-ignore
    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;