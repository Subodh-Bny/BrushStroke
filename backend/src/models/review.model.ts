import mongoose, { Schema, Document } from "mongoose";

interface IReview extends Document {
  customer: mongoose.Types.ObjectId;
  artwork: mongoose.Types.ObjectId;
  rating: number; // Between 1 and 5
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  artwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Arwtork",
    required: true,
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;
