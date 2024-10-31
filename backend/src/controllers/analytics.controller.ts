import { Request, Response } from "express";
import { internalError } from "./controllerError";
import PaymentDetail, { IPaymentDetails } from "../models/payment.model";
import Artwork, { IArtwork } from "../models/artwork.model";
import Order from "../models/order.model";
import User from "../models/user.model";

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const payments: IPaymentDetails[] = await PaymentDetail.find();
    const totalRevenue =
      payments.reduce(
        (total, acc) =>
          acc.status === "Completed" ? acc.total_amount + total : total,
        0
      ) / 100;

    const artworks: IArtwork[] = await Artwork.find();

    const totalAvailableArtworks = artworks.reduce(
      (total, acc) => (acc.availability ? total + 1 : total),
      0
    );

    const startOfWeek = new Date();
    startOfWeek.setUTCHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getUTCDay());

    const newOrders = await Order.find({
      createdAt: { $gte: startOfWeek, $lte: new Date() },
    });

    const newCustomers = await User.find({
      createdAt: { $gte: startOfWeek, $lte: new Date() },
    }).select("-password");

    res.status(200).json({
      message: "Analytics fetched",
      data: {
        totalRevenue,
        totalAvailableArtworks,
        newOrders,
        newCustomers: newCustomers.length,
      },
    });
  } catch (error) {
    internalError("Error in getAnalytics Controller", error, res);
  }
};
