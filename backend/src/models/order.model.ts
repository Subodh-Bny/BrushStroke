import mongoose, { Schema, Document } from "mongoose";

interface IOrder extends Document {
  customer: mongoose.Types.ObjectId;
  artworks: {
    artwork: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  paymentStatus: string;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  artworks: [
    {
      artwork: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artwork",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING",
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
