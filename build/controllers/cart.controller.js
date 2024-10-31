"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItemFromCart = exports.getCart = exports.addToCart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const controllerError_1 = require("./controllerError");
const addToCart = async (req, res) => {
    const { artworkId } = req.body;
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        let cart = await cart_model_1.default.findOne({ userId });
        if (!cart) {
            cart = new cart_model_1.default({ userId, items: [{ artwork: artworkId }] });
        }
        else {
            const itemExists = cart.items.some((item) => item.artwork.toString() === artworkId);
            if (itemExists) {
                return res.status(409).json({ message: "Item is already in the cart" });
            }
            cart.items.push({ artwork: artworkId });
        }
        await cart.save();
        return res.status(201).json({ message: "Item added to cart", data: cart });
    }
    catch (error) {
        (0, controllerError_1.internalError)("Error adding item to cart", error, res);
    }
};
exports.addToCart = addToCart;
const getCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const cart = await cart_model_1.default.findOne({ userId }).populate({
            path: "items.artwork",
            model: "Artwork",
        });
        if (!cart || cart.items.length === 0) {
            return res.status(200).json({ data: { items: [] } });
        }
        return res
            .status(200)
            .json({ message: "Cart fetched successfully", data: cart });
    }
    catch (error) {
        (0, controllerError_1.internalError)("Error in get cart controller", error, res);
    }
};
exports.getCart = getCart;
const removeItemFromCart = async (req, res) => {
    try {
        const artworkId = req.params.id;
        if (!artworkId) {
            return res.status(400).json({ message: "Artwork ID is required" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(artworkId)) {
            return res.status(400).json({ error: "Invalid artwork ID" });
        }
        const result = await cart_model_1.default.findOneAndUpdate({ "items.artwork": artworkId }, { $pull: { items: { artwork: artworkId } } }, // Remove the item
        { new: true } // Return the updated cart after modification
        );
        if (!result) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        return res
            .status(202)
            .json({ message: "Item removed successfully", data: result });
    }
    catch (error) {
        (0, controllerError_1.internalError)("Error in remove cart item controller", error, res);
    }
};
exports.removeItemFromCart = removeItemFromCart;
//# sourceMappingURL=cart.controller.js.map