import mongoose from "mongoose";
import { Request, Response } from "express";
import User from "../models/user.model";
import Artwork from "../models/artwork.model";
import { internalError } from "./controllerError";

export const createArtwork = async (req: Request, res: Response) => {
  try {
    const { title, description, price, image, category, artist } = req.body;
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "Invalid category id" });
      }
    }
    let user;
    if (artist) {
      if (!mongoose.Types.ObjectId.isValid(artist)) {
        return res.status(400).json({ message: "Invalid artist id" });
      }

      user = await User.findById(artist);
      if (user) {
        if (user.role !== "ARTIST")
          return res.status(400).json({ message: "User is not an artist" });
      } else {
        return res.status(400).json({ message: "User not found" });
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
        category: newArtwork.category,
        artist: user,
      },
    });
  } catch (error: any) {
    internalError("Error in create artwork controller", error, res);
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
      .json({ message: "Artworks fetched successfully", data: artworks });
  } catch (error: any) {
    internalError("Error in  getAllArtworks controller", error, res);
  }
};

export const getArtworksByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

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
      data: artworks,
    });
  } catch (error: any) {
    internalError("Error in  getArtworksByCategory controller", error, res);
  }
};
export const getArtworkById = async (req: Request, res: Response) => {
  try {
    const artworkId = req.params.id as string;

    if (!artworkId || !mongoose.Types.ObjectId.isValid(artworkId as string)) {
      return res.status(400).json({ message: "Invalid or missing artwork id" });
    }

    const artwork = await Artwork.findOne({ _id: artworkId }).populate(
      "artist category"
    );

    if (!artwork) {
      return res.status(404).json({ message: "No artwork found" });
    }

    return res.status(200).json({
      message: "Artwork fetched successfully",
      data: artwork,
    });
  } catch (error: any) {
    internalError("Error in  getARtworkById controller", error, res);
  }
};

export const updateArtwork = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, image, category, artist, availability } =
      req.body;

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "Invalid category id" });
      }
    }

    let user;
    if (artist) {
      if (!mongoose.Types.ObjectId.isValid(artist)) {
        return res.status(400).json({ message: "Invalid artist id" });
      }

      user = await User.findById(artist);
      if (user) {
        if (user.role !== "ARTIST") {
          return res.status(400).json({ message: "User is not an artist" });
        }
      } else {
        return res.status(400).json({ message: "User not found" });
      }
    }

    const updateFields: any = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (price) updateFields.price = price;
    if (image) updateFields.image = image;
    if (category) updateFields.category = category;
    if (artist) updateFields.artist = artist;
    if (typeof availability === "boolean") {
      updateFields.availability = availability;
    }

    const updatedArtwork = await Artwork.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedArtwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    return res.status(200).json({
      message: "Artwork updated successfully",
      artwork: updatedArtwork,
    });
  } catch (error: any) {
    internalError("Error in  update artwork controller", error, res);
  }
};

export const deleteArtwork = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Artwork id is required" });
    }
    const result = await Artwork.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Couldn't delete artwork" });
    }
    return res.status(202).json({ message: "Artwork deleted successfully" });
  } catch (error: any) {
    internalError("Error in  delete artwork controller", error, res);
  }
};

export const setFeaturedArtwork = async (req: Request, res: Response) => {
  const { artworkId } = req.params;

  try {
    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    const isCurrentlyFeatured = artwork.isFeatured;

    if (!isCurrentlyFeatured) {
      await Artwork.updateMany(
        { isFeatured: true },
        { $set: { isFeatured: false } }
      );
    }

    artwork.isFeatured = !isCurrentlyFeatured;
    await artwork.save();

    return res.status(200).json({
      message: `Artwork is now ${
        artwork.isFeatured ? "featured" : "not featured"
      }`,
      data: artwork,
    });
  } catch (error: any) {
    internalError("Error in  setFeaturedArtwork  controller", error, res);
  }
};

export const getFeaturedArtwork = async (req: Request, res: Response) => {
  try {
    const featuredArtwork = await Artwork.findOne({ isFeatured: true })
      .populate("artist")
      .select("-password");
    if (featuredArtwork) {
      return res
        .status(200)
        .json({ message: "Featured Artwork fetched", data: featuredArtwork });
    }

    return res.status(404).json({ message: "No featured artwork" });
  } catch (error: any) {
    internalError("Error in  getFeaturedArtwork  controller", error, res);
  }
};
