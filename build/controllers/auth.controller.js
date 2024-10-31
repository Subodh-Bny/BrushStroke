"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const controllerError_1 = require("./controllerError");
const signup = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, profilePic, role } = req.body;
        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({ success: false, message: "Passwords do not match" });
        }
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: "Email already exists" });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const userProfilePic = `https://avatar.iran.liara.run/username?username=${username}`;
        const newUser = new user_model_1.default({
            username,
            email,
            password: hashedPassword,
            role,
            profilePic: profilePic || userProfilePic,
        });
        await newUser.save();
        // generateTokenAndCookie(newUser._id, res);
        return res.status(201).json({
            message: "Signup successfull",
            data: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                profilePic: newUser.profilePic,
            },
        });
    }
    catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            return res.status(400).json({
                success: false,
                message: `The ${field} is already in use. Please choose a different one.`,
            });
        }
        (0, controllerError_1.internalError)("Error in  signup  controller", error, res);
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email });
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, user?.password || "");
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = (0, generateToken_1.default)(user?._id, res);
        return res.status(200).json({
            message: "Logged in",
            data: {
                _id: user?._id,
                username: user?.username,
                email: user?.email,
                profilePic: user?.profilePic,
                role: user?.role,
                shippingAddress: user?.shippingAddress,
                phoneNumber: user?.phoneNumber,
            },
            token,
        });
    }
    catch (error) {
        (0, controllerError_1.internalError)("Error in  login  controller", error, res);
    }
};
exports.login = login;
// export const logout = (req: Request, res: Response) => {
//   try {
//     res.cookie("jwt", "", { maxAge: 0 });
//     return res.status(200).json({ message: "Logged out successfully" });
//   } catch (error: any) {
//     console.log("Error in logout controller", error.message);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };
//# sourceMappingURL=auth.controller.js.map