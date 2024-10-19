import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  artwork: mongoose.Schema.Types.ObjectId;
  quantity?: number;
}

export interface ICart extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  items: ICartItem[];
}

const cartSchema = new mongoose.Schema<ICart>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      artwork: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artwork",
        required: true,
      },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
});

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
