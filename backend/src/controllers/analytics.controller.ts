import { Request, Response } from "express";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { internalError } from "./controllerError";
import PaymentDetail, { IPaymentDetails } from "../models/payment.model";
import Artwork, { IArtwork } from "../models/artwork.model";
import Order from "../models/order.model";
import User from "../models/user.model";

const now = new Date();

const currentMonthStart = startOfMonth(now);
const currentMonthEnd = endOfMonth(now);
const previousMonthStart = startOfMonth(subMonths(now, 1));
const previousMonthEnd = endOfMonth(subMonths(now, 1));

const calculateRevenueChange = async () => {
  const currentMonthRevenue = await PaymentDetail.aggregate([
    {
      $match: { createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd } },
    },
    { $group: { _id: null, total_amount: { $sum: "$total_amount" } } },
  ]);

  const previousMonthRevenue = await PaymentDetail.aggregate([
    {
      $match: {
        createdAt: { $gte: previousMonthStart, $lte: previousMonthEnd },
      },
    },
    { $group: { _id: null, total_amount: { $sum: "$total_amount" } } },
  ]);

  const currentRevenue = currentMonthRevenue[0]?.total_amount || 0;
  const previousRevenue = previousMonthRevenue[0]?.total_amount || 0;
  console.log(previousRevenue);
  console.log(currentRevenue);
  const revenueChangePercentage =
    previousRevenue === 0
      ? currentRevenue > 0
        ? 100
        : 0
      : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

  return revenueChangePercentage.toFixed(2);
};

const calculateWeeklyOrderChange = async () => {
  const startOfCurrentWeek = new Date();
  startOfCurrentWeek.setDate(
    startOfCurrentWeek.getDate() - startOfCurrentWeek.getDay()
  );

  const endOfCurrentWeek = new Date(startOfCurrentWeek);
  endOfCurrentWeek.setDate(endOfCurrentWeek.getDate() + 6);

  const startOfPreviousWeek = new Date(startOfCurrentWeek);
  startOfPreviousWeek.setDate(startOfPreviousWeek.getDate() - 7);

  const endOfPreviousWeek = new Date(startOfPreviousWeek);
  endOfPreviousWeek.setDate(endOfPreviousWeek.getDate() + 6);

  const currentWeekOrders = await Order.countDocuments({
    createdAt: { $gte: startOfCurrentWeek, $lte: endOfCurrentWeek },
  });

  const previousWeekOrders = await Order.countDocuments({
    createdAt: { $gte: startOfPreviousWeek, $lte: endOfPreviousWeek },
  });

  const orderChangePercentage =
    previousWeekOrders === 0
      ? currentWeekOrders > 0
        ? 100
        : -100
      : ((currentWeekOrders - previousWeekOrders) / previousWeekOrders) * 100;

  return orderChangePercentage.toFixed(2);
};

const calculateMonthlyCustomerChange = async () => {
  const currentMonthCustomers = await User.countDocuments({
    createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd },
    role: { $in: ["CUSTOMER", "ARTIST"] },
  });

  const previousMonthCustomers = await User.countDocuments({
    createdAt: { $gte: previousMonthStart, $lte: previousMonthEnd },
    role: { $in: ["CUSTOMER", "ARTIST"] },
  });

  const customerChangePercentage =
    previousMonthCustomers === 0
      ? currentMonthCustomers > 0
        ? 100
        : -100
      : ((currentMonthCustomers - previousMonthCustomers) /
          previousMonthCustomers) *
        100;

  return customerChangePercentage.toFixed(2);
};

const calculateMonthlyAvailableArtworksChange = async () => {
  const currentMonthAvailableArtworks = await Artwork.countDocuments({
    createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd },
    availability: true,
  });

  const previousMonthAvailableArtworks = await Artwork.countDocuments({
    createdAt: { $gte: previousMonthStart, $lte: previousMonthEnd },
    availability: true,
  });

  const availableArtworksChangePercentage =
    previousMonthAvailableArtworks === 0
      ? currentMonthAvailableArtworks > 0
        ? 100
        : -100
      : ((currentMonthAvailableArtworks - previousMonthAvailableArtworks) /
          previousMonthAvailableArtworks) *
        100;

  return availableArtworksChangePercentage.toFixed(2);
};

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

    const revenueChangePercent = await calculateRevenueChange();
    const orderChangePercent = await calculateWeeklyOrderChange();
    const customerChangePercent = await calculateMonthlyCustomerChange();
    const availableArtworkChangePercent =
      await calculateMonthlyAvailableArtworksChange();

    res.status(200).json({
      message: "Analytics fetched",
      data: {
        totalRevenue,
        totalAvailableArtworks,
        newOrders,
        newCustomers: newCustomers.length,
        revenueChangePercent,
        orderChangePercent,
        customerChangePercent,
        availableArtworkChangePercent,
      },
    });
  } catch (error) {
    internalError("Error in getAnalytics Controller", error, res);
  }
};
