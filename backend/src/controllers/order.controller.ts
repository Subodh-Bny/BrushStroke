import { Request, Response } from "express";
import Order from "../models/order.model";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { user, artworks, status, totalPrice } = req.body;

    const newOrder = new Order({
      user,
      artworks,
      status,
      totalPrice,
    });

    await newOrder.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error: any) {
    console.log("Error in createOrder controller", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("user artworks");

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error: any) {
    console.log("Error in getAllOrders controller", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate("user artworks");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error: any) {
    console.log("Error in getOrderById controller", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("user artworks");

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.log("Error in updateOrder controller", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error: any) {
    console.log("Error in deleteOrder controller", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
