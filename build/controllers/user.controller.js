"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const getAllUsers = async (req, res) => {
    try {
        const users = await user_model_1.default.find().select("-password");
        if (users) {
            const filteredUsers = users.filter((user) => user.role !== "ADMIN");
            return res
                .status(200)
                .json({ message: "Users fetched successfully", users: filteredUsers });
        }
        return res.status(400).json({ message: "Coundnot fetch users" });
    }
    catch (error) {
        console.log("Error in get all users controller", error.message);
        return res
            .status(500)
            .json({ error: "Internal server error", message: error.messsage });
    }
};
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=user.controller.js.map