import mongoose, { Schema, Document } from "mongoose";

export interface IArtwork extends Document {
  title: string;
  description: string;
  price: number;
  image: string;
  category: mongoose.Types.ObjectId;
  availability: boolean;
  artist: mongoose.Types.ObjectId;
  createdAt: Date;
  isFeatured: boolean;
}

const artworkSchema = new Schema<IArtwork>({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  availability: { type: Boolean, default: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  isFeatured: { type: Boolean, default: false },
});

const Artwork = mongoose.model<IArtwork>("Artwork", artworkSchema);
export default Artwork;
