"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEsewaSignature = exports.verifyKhaltiPaymentAndUpdateOrder = exports.verifyKhaltiPayment = exports.initiateKhaltiPayment = void 0;
const crypto_1 = require("crypto");
const axios_1 = __importDefault(require("axios"));
const order_model_1 = __importDefault(require("../models/order.model"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const initiateKhaltiPayment = async (req, res) => {
    try {
        const { returnUrl, websiteUrl, amount, purchaseOrderId, purchaseOrderName, customerInfo, } = req.body;
        const paymentData = {
            return_url: returnUrl,
            website_url: websiteUrl,
            amount: amount * 100,
            purchase_order_id: purchaseOrderId,
            purchase_order_name: purchaseOrderName,
            customer_info: customerInfo,
        };
        console.log(paymentData);
        const response = await axios_1.default.post("https://a.khalti.com/api/v2/epayment/initiate/", paymentData, {
            headers: {
                Authorization: `Key ${process.env.LIVE_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });
        // console.log(response);
        res.json(response.data);
    }
    catch (error) {
        console.error("Error initiating payment:");
        res
            .status(500)
            .json({ message: "Failed to initiate payment", error: req.body });
    }
};
exports.initiateKhaltiPayment = initiateKhaltiPayment;
const verifyKhaltiPayment = async (pidx) => {
    try {
        const response = await axios_1.default.post("https://a.khalti.com/api/v2/epayment/lookup/", {
            pidx,
        }, {
            headers: {
                Authorization: `Key ${process.env.LIVE_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
    catch (error) {
        console.log("Khalti Payment Verification Error", error.message);
        return { success: false, message: "Error verifying payment" };
    }
};
exports.verifyKhaltiPayment = verifyKhaltiPayment;
const verifyKhaltiPaymentAndUpdateOrder = async (req, res) => {
    try {
        const { pidx, purchase_order_id } = req.body;
        const paymentDetails = await (0, exports.verifyKhaltiPayment)(pidx);
        console.log(paymentDetails);
        const updatedOrder = await order_model_1.default.findByIdAndUpdate(purchase_order_id, {
            paymentDetails: paymentDetails,
        }, { new: true });
        const updateCart = await cart_model_1.default.findOneAndUpdate({ userId: updatedOrder?.user }, { $set: { items: [] } }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        return res.status(200).json({
            message: "Payment verified, order status updated successfully",
            order: updatedOrder,
        });
    }
    catch (error) {
        console.log("Error in verifyPaymentAndUpdateOrder controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.verifyKhaltiPaymentAndUpdateOrder = verifyKhaltiPaymentAndUpdateOrder;
const generateEsewaSignature = async (req, res) => {
    try {
        const { amount, failure_url, product_delivery_charge, product_service_charge, success_url, tax_amount, total_amount, transaction_uuid, } = req.body;
        const signed_field_names = "total_amount,transaction_uuid,product_code";
        const product_code = "EPAYTEST";
        const signatureMessage = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
        const signature = (0, crypto_1.createHmac)("sha256", process.env.ESEWA_SECRET_KEY || "")
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
    }
    catch (error) {
        console.error("Error generating signature:", error);
        res
            .status(500)
            .json({ message: "Failed to generate signature", error: error });
    }
};
exports.generateEsewaSignature = generateEsewaSignature;
//# sourceMappingURL=payment.controller.js.map