import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  artworks: mongoose.Types.ObjectId[];
  status: string; // "Pending", "Shipped", "Delivered"

  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  paymentDetails: {
    pidx: string;
    total_amount: number;
    status: string;
    transaction_id: string;
    fee: number;
    refunded: boolean;
  };
}

const OrderSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
      index: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },

    paymentDetails: {
      pidx: {
        type: String,
      },
      total_amount: {
        type: Number,
      },
      status: {
        type: String,

        default: "Pending",
      },
      transaction_id: {
        type: String,
      },
      fee: {
        type: Number,
        default: 0,
      },
      refunded: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
