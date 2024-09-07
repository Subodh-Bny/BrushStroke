import mongoose, { Schema, Document } from "mongoose";

interface IArtwork extends Document {
  title: string;
  description: string;
  price: number;
  image: string;
  category: mongoose.Types.ObjectId;
  artist: mongoose.Types.ObjectId;
  createdAt: Date;
}

const artworkSchema = new Schema<IArtwork>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Linked to a seller/artist
  createdAt: { type: Date, default: Date.now },
});

const Artwork = mongoose.model<IArtwork>("Artwork", artworkSchema);
export default Artwork;
