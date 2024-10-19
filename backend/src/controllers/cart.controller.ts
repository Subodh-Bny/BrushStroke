import { Response, Request } from "express";
import mongoose from "mongoose";
import Cart, { ICartItem } from "../models/cart.model";

interface CustomRequest extends Request {
  user?: { _id: string };
}

export const addToCart = async (req: CustomRequest, res: Response) => {
  const { artworkId } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ artwork: artworkId }] });
    } else {
      const itemExists = cart.items.some(
        (item: ICartItem) => item.artwork.toString() === artworkId
      );

      if (itemExists) {
        return res.status(409).json({ message: "Item is already in the cart" });
      }

      cart.items.push({ artwork: artworkId });
    }

    await cart.save();
    return res.status(201).json({ message: "Item added to cart", data: cart });
  } catch (error: any) {
    console.error("Error adding item to cart", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getCart = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.artwork",
      model: "Artwork",
    });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ data: { items: [] } });
    }

    return res
      .status(200)
      .json({ message: "Cart fetched successfully", data: cart });
  } catch (error: any) {
    console.error("Error in get cart controller", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const removeItemFromCart = async (req: Request, res: Response) => {
  try {
    const artworkId = req.params.id;

    if (!artworkId) {
      return res.status(400).json({ message: "Artwork ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(artworkId)) {
      return res.status(400).json({ error: "Invalid artwork ID" });
    }

    const result = await Cart.findOneAndUpdate(
      { "items.artwork": artworkId },
      { $pull: { items: { artwork: artworkId } } }, // Remove the item
      { new: true } // Return the updated cart after modification
    );

    if (!result) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res
      .status(202)
      .json({ message: "Item removed successfully", data: result });
  } catch (error: any) {
    console.error("Error in remove cart item controller", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
