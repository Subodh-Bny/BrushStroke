import { Request, Response } from "express";
import axios from "axios";
import Order from "../models/order.model";

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const {
      returnUrl,
      websiteUrl,
      amount,
      purchaseOrderId,
      purchaseOrderName,
      customerInfo,
    } = req.body;

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: returnUrl,
        website_url: websiteUrl,
        amount,
        purchase_order_id: purchaseOrderId,
        purchase_order_name: purchaseOrderName,
        customer_info: customerInfo,
      },
      {
        headers: {
          Authorization: `Key ${process.env.LIVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};

export const verifyPayment = async (
  token: string,
  amount: number,
  purchase_order_id: string
) => {
  try {
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/verify/",
      {
        token,
        amount,
        purchase_order_id,
      },
      {
        headers: {
          Authorization: `Key ${process.env.LIVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 && response.data.state === "Completed") {
      return {
        success: true,
        details: response.data,
      };
    } else {
      return { success: false, message: "Payment verification failed" };
    }
  } catch (error: any) {
    console.log("Khalti Payment Verification Error", error.message);
    return { success: false, message: "Error verifying payment" };
  }
};

export const verifyPaymentAndUpdateOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      orderId: purchase_order_id,
      paymentToken: token,
      amount,
    } = req.body;

    const paymentStatus = await verifyPayment(token, amount, purchase_order_id);

    if (!paymentStatus.success) {
      return res.status(400).json({ error: paymentStatus.message });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      purchase_order_id,
      { status: "Paid", paymentDetails: paymentStatus.details },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      message: "Payment verified, order status updated successfully",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.log(
      "Error in verifyPaymentAndUpdateOrder controller",
      error.message
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};
