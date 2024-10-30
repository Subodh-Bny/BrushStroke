import { Request, Response } from "express";
import { createHmac } from "crypto";
import axios from "axios";
import Order from "../models/order.model";
import Cart from "../models/cart.model";
import { internalError } from "./controllerError";
import PaymentDetails from "../models/payment.model";

export const initiateKhaltiPayment = async (req: Request, res: Response) => {
  try {
    const {
      returnUrl,
      websiteUrl,
      amount,
      purchaseOrderId,
      purchaseOrderName,
      customerInfo,
    } = req.body;

    const paymentData = {
      return_url: returnUrl,
      website_url: websiteUrl,
      amount: amount * 100,
      purchase_order_id: purchaseOrderId,
      purchase_order_name: purchaseOrderName,
      customer_info: customerInfo,
    };
    console.log(paymentData);

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      paymentData,
      {
        headers: {
          Authorization: `Key ${process.env.LIVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(response);
    res.json(response.data);
  } catch (error) {
    internalError("Error initiating payment", error, res);
  }
};

export const verifyKhaltiPayment = async (pidx: string) => {
  try {
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      {
        pidx,
      },
      {
        headers: {
          Authorization: `Key ${process.env.LIVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("Khalti Payment Verification Error", error.message);
    return { success: false, message: "Error verifying payment" };
  }
};

export const verifyKhaltiPaymentAndUpdateOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const { pidx, purchase_order_id } = req.body;

    const paymentDetails = await verifyKhaltiPayment(pidx);

    if (!purchase_order_id) {
      return res.status(400).json({ message: "Purchase order id is required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      purchase_order_id,
      {
        paymentDetails: paymentDetails,
      },
      { new: true }
    );

    const oldPayment = await PaymentDetails.findOne({
      orderId: purchase_order_id,
    });

    if (!oldPayment) {
      const newPayment = new PaymentDetails({
        ...paymentDetails,
        orderId: purchase_order_id,
      });

      if (!newPayment) {
        return res.status(400).json({ message: "Couldn't create payment." });
      }

      await newPayment.save();
    } else {
      await oldPayment.updateOne({
        $set: { ...paymentDetails },
      });
    }

    const updateCart = await Cart.findOneAndUpdate(
      { userId: updatedOrder?.user },
      { $set: { items: [] } },
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
    internalError(
      "Error in verifyPaymentAndUpdateOrder controller",
      error,
      res
    );
  }
};

export const generateEsewaSignature = async (req: Request, res: Response) => {
  try {
    const {
      amount,
      failure_url,
      product_delivery_charge,
      product_service_charge,
      success_url,
      tax_amount,
      total_amount,
      transaction_uuid,
    } = req.body;

    const signed_field_names = "total_amount,transaction_uuid,product_code";
    const product_code = "EPAYTEST";
    const signatureMessage = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const signature = createHmac("sha256", process.env.ESEWA_SECRET_KEY || "")
      .update(signatureMessage)
      .digest("base64");

    const paymentData = {
      amount,
      failure_url,
      product_delivery_charge,
      product_service_charge,
      product_code,
      signature,
      signed_field_names,
      success_url,
      tax_amount,
      total_amount,
      transaction_uuid,
    };
    console.log(paymentData);

    res.status(200).json({ signature, signed_field_names });
  } catch (error) {
    console.error("Error generating signature:", error);
    res
      .status(500)
      .json({ message: "Failed to generate signature", error: error });
  }
};

export const getPaymentDetails = async (req: Request, res: Response) => {
  try {
    const paymentDetails = await PaymentDetails.find();
    if (paymentDetails)
      return res.status(200).json({
        message: "Payment details fetched successfully.",
        data: paymentDetails,
      });
    return res.status(400).json({ message: "Couldn't fetch payment details." });
  } catch (error) {
    internalError("Error in getPaymentDetails controller", error, res);
  }
};
