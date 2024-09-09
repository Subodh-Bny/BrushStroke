import mongoose from "mongoose";
import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import Artwork from "../models/artwork.model";

export const createArtwork = async (req: Request, res: Response) => {
  try {
    const { title, description, price, image, category, artist } = req.body;
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ error: "Invalid category id" });
      }
    }
    let user;
    if (artist) {
      if (!mongoose.Types.ObjectId.isValid(artist)) {
        return res.status(400).json({ error: "Invalid artist id" });
      }

      user = await User.findById(artist);
      if (user) {
        if (user.role !== "ARTIST")
          return res.status(400).json({ error: "User is not an artist" });
      } else {
        return res.status(400).json({ error: "User not found" });
      }
    }

    const newArtwork = new Artwork({
      title,
      description,
      price,
      image,
      category,
      artist,
    });

    await newArtwork.save();

    return res.status(201).json({
      message: "Artwork created",
      artwork: {
        _id: newArtwork._id,
        title: newArtwork.title,
        description: newArtwork.description,
        price: newArtwork.description,
        image: newArtwork.image,
        artist: user,
      },
    });
  } catch (error: any) {
    console.log("Error in create artwork controller", error.message);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

export const getAllArtworks = async (req: Request, res: Response) => {
  try {
    const artworks = await Artwork.find().populate({
      path: "artist",
      select: "-password",
    });
    return res
      .status(200)
      .json({ message: "Artworks fetched successfully", artworks });
  } catch (error: any) {
    console.error("Error in getAllArtworks controller:", error.message);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

export const getArtworksByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;

    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId as string)) {
      return res.status(400).json({ error: "Invalid or missing category id" });
    }

    const artworks = await Artwork.find({ category: categoryId }).populate(
      "artist category"
    );

    if (!artworks) {
      return res.status(404).json({ error: "No artworks found" });
    }

    return res.status(200).json({
      message: "Artworks fetched successfully",
      artworks,
    });
  } catch (error: any) {
    console.log("Error in getArtworksByCategory controller", error.message);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

export const updateArtwork = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, image, category, artist } = req.body;

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ error: "Invalid category id" });
      }
    }

    let user;
    if (artist) {
      if (!mongoose.Types.ObjectId.isValid(artist)) {
        return res.status(400).json({ error: "Invalid artist id" });
      }

      user = await User.findById(artist);
      if (user) {
        if (user.role !== "ARTIST") {
          return res.status(400).json({ error: "User is not an artist" });
        }
      } else {
        return res.status(400).json({ error: "User not found" });
      }
    }

    const updateFields: any = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (price) updateFields.price = price;
    if (image) updateFields.image = image;
    if (category) updateFields.category = category;
    if (artist) updateFields.artist = artist;

    const updatedArtwork = await Artwork.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedArtwork) {
      return res.status(404).json({ error: "Artwork not found" });
    }

    return res.status(200).json({
      message: "Artwork updated successfully",
      artwork: updatedArtwork,
    });
  } catch (error: any) {
    console.log("Error in update artwork controller", error.message);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

export const deleteArtwork = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Artwork id is required" });
    }
    const result = await Artwork.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: "Couldn't delete artwork" });
    }
    return res.status(202).json({ message: "Artwork deleted successfully" });
  } catch (error: any) {
    console.log("Error in delete artwork controller", error.message);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};
