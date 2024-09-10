import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  artworks: mongoose.Types.ObjectId[];
  status: string; // "Pending", "Shipped", "Delivered"
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    artworks: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Artwork",
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered"],
      default: "Pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
