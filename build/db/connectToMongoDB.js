"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectToMongoDB = async () => {
    try {
        if (process.env.MONGO_DB_URI) {
            await mongoose_1.default.connect(process.env.MONGO_DB_URI);
            console.log("Connected to database");
        }
        else {
            throw new Error("Database URI not found");
        }
    }
    catch (error) {
        console.log("Error connecting to MongoDB", error.message);
    }
};
exports.default = connectToMongoDB;
//# sourceMappingURL=connectToMongoDB.js.map