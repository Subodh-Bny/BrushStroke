"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.getOrderByUserId = exports.getOrderById = exports.getAllOrders = exports.createOrder = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const createOrder = async (req, res) => {
    try {
        const userId = req?.user?._id;
        if (userId) {
            const { artworks, status, totalPrice, shippingAddress, phoneNumber } = req.body;
            const newOrder = new order_model_1.default({
                user: userId,
                artworks,
                paymentDetails: { status },
                totalPrice,
            });
            const updatedUser = await user_model_1.default.findByIdAndUpdate(userId, {
                $set: {
                    shippingAddress,
                    phoneNumber,
                },
            }, { new: true } // Return the updated user
            ).select("-password -role");
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            await newOrder.save();
            return res.status(201).json({
                message: "Order created successfully",
                data: {
                    order: newOrder,
                    user: updatedUser,
                },
            });
        }
    }
    catch (error) {
        console.log("Error in createOrder controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createOrder = createOrder;
const getAllOrders = async (req, res) => {
    try {
        const orders = await order_model_1.default.find().populate("user artworks");
        return res.status(200).json({
            message: "Orders fetched successfully",
            data: orders,
        });
    }
    catch (error) {
        console.log("Error in getAllOrders controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllOrders = getAllOrders;
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await order_model_1.default.findById(id).populate("user artworks");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json({
            message: "Order fetched successfully",
            data: order,
        });
    }
    catch (error) {
        console.log("Error in getOrderById controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getOrderById = getOrderById;
const getOrderByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const order = await order_model_1.default.find({ user: userId }).populate([
            { path: "user", select: "-password" },
            { path: "artworks" },
        ]);
        if (!order) {
            return res.status(404).json({ message: "No orders found!" });
        }
        return res.status(200).json({
            message: "Order fetched successfully",
            data: order,
        });
    }
    catch (error) {
        console.log("Error in getOrderByUserId controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getOrderByUserId = getOrderByUserId;
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedOrder = await order_model_1.default.findByIdAndUpdate(id, updates, {
            new: true,
        }).populate("user artworks");
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json({
            message: "Order updated successfully",
            order: updatedOrder,
        });
    }
    catch (error) {
        console.log("Error in updateOrder controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateOrder = updateOrder;
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await order_model_1.default.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json({
            message: "Order deleted successfully",
        });
    }
    catch (error) {
        console.log("Error in deleteOrder controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteOrder = deleteOrder;
//# sourceMappingURL=order.controller.js.map