import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  profilePic: string;
  createdAt: Date;
  shippingAddress: string;
  phoneNumber: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["ADMIN", "ARTIST", "CUSTOMER"],
    default: "CUSTOMER",
  },
  profilePic: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  shippingAddress: { type: String, default: "" },
  phoneNumber: { type: String },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
