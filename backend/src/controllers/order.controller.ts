import { Request, Response } from "express";
import Order from "../models/order.model";
import { CustomRequest } from "./cart.controller";
import User from "../models/user.model";
import { internalError } from "./controllerError";
import Artwork from "../models/artwork.model";
import Cart from "../models/cart.model";

export const createOrder = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req?.user?._id;
    if (userId) {
      const { artworks, status, totalPrice, shippingAddress, phoneNumber } =
        req.body;

      const notAvailable = await Artwork.findOne({
        availability: false,
        _id: { $in: artworks },
      });

      if (notAvailable) {
        return res.status(404).json({
          message: `The artwork ${notAvailable.title} is currently unavailable. Please check back later.`,
        });
      }

      const newOrder = new Order({
        user: userId,
        artworks,
        paymentDetails: { status },
        totalPrice,
      });

      const updatedArtwork = await Artwork.updateMany(
        {
          _id: { $in: artworks },
        },
        { $set: { availability: false } }
      );

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            shippingAddress,
            phoneNumber,
          },
        },
        { new: true } // Return the updated user
      ).select("-password -role");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const updateCart = await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [] } },
        { new: true }
      );

      await newOrder.save();

      return res.status(201).json({
        message: "Order created successfully",
        data: {
          order: newOrder,
          user: updatedUser,
        },
      });
    }
  } catch (error: any) {
    internalError("Error in createOrder controller", error, res);
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  const skip = (page - 1) * limit;

  try {
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate("artworks")
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error: any) {
    internalError("Error in getAllOrders controller", error, res);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate({ path: "user", select: "-password" })
      .populate("artworks");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error: any) {
    internalError("Error in getOrderById controller", error, res);
  }
};

export const getOrderByUserId = async (req: CustomRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  const skip = (page - 1) * limit;

  try {
    const { userId } = req.params;
    const totalOrders = await Order.countDocuments({ user: userId });

    const order = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate([{ path: "user", select: "-password" }, { path: "artworks" }])
      .skip(skip)
      .limit(limit);

    if (!order) {
      return res.status(404).json({ message: "No orders found!" });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      data: order,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error: any) {
    internalError("Error in getOrderByUserId controller", error, res);
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
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error: any) {
    internalError("Error in updateOrder controller", error, res);
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error: any) {
    internalError("Error in deleteOrder controller", error, res);
  }
};
