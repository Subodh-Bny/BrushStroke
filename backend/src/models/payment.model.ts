import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentDetails extends Document {
  pidx: string;
  total_amount: number;
  status: string;
  transaction_id: string;
  fee: number;
  refunded: boolean;
  orderId: mongoose.Types.ObjectId;
}

const PaymentDetailsSchema: Schema = new mongoose.Schema<IPaymentDetails>({
  pidx: { type: String, required: true },
  total_amount: { type: Number, default: 0 },
  status: { type: String },
  transaction_id: { type: String, required: true },
  fee: { type: Number, default: 0 },
  refunded: { type: Boolean },
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const PaymentDetail = mongoose.model<IPaymentDetails>(
  "PaymentDetail",
  PaymentDetailsSchema
);

export default PaymentDetail;
