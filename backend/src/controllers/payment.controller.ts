import { Request, Response } from "express";
import axios from "axios";

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

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { token, amount, purchase_order_id } = req.body;

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

    res.json(response.data);
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};
