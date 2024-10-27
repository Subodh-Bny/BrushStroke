"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // console.log(req);
        if (!token) {
            return res
                .status(401)
                .json({ message: "Uauthorized - No Token Provided" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        if (!decoded) {
            return res.status(401).json({ message: "Uauthorized  - Invalid Token" });
        }
        const user = await user_model_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //@ts-ignore
        req.user = user;
        next();
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.default = protectRoute;
//# sourceMappingURL=protectRoute.js.map