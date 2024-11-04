import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { NextFunction, Response, Request } from "express";

interface JwtPayloadWithUserId extends jwt.JwtPayload {
  userId: string;
}

const adminRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    // console.log(req);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Uauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayloadWithUserId;

    if (!decoded) {
      return res.status(401).json({ message: "Uauthorized  - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "ADMIN") {
      return res.status(401).json({ message: "User is not admin" });
    }

    //@ts-ignore
    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default adminRoute;
