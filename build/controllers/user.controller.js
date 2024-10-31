"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArtists = exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const controllerError_1 = require("./controllerError");
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
        (0, controllerError_1.internalError)("Error in get all users controller", error, res);
    }
};
exports.getAllUsers = getAllUsers;
const getArtists = async (req, res) => {
    try {
        const users = await user_model_1.default.find().select("-password");
        if (users) {
            const filteredUsers = users.filter((user) => user.role === "ARTIST");
            return res
                .status(200)
                .json({ message: "Artists fetched successfully", data: filteredUsers });
        }
        return res.status(400).json({ message: "Coundnot fetch users" });
    }
    catch (error) {
        (0, controllerError_1.internalError)("Error in get artists controller", error, res);
    }
};
exports.getArtists = getArtists;
//# sourceMappingURL=user.controller.js.map