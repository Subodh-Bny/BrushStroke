"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeaturedArtwork = exports.setFeaturedArtwork = exports.deleteArtwork = exports.updateArtwork = exports.getArtworkById = exports.getArtworksByCategory = exports.getAllArtworks = exports.createArtwork = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const artwork_model_1 = __importDefault(require("../models/artwork.model"));
const controllerError_1 = require("./controllerError");
const createArtwork = async (req, res) => {
    try {
        const { title, description, price, image, category, artist } = req.body;
        if (category) {
            if (!mongoose_1.default.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ message: "Invalid category id" });
            }
        }
        let user;
        if (artist) {
            if (!mongoose_1.default.Types.ObjectId.isValid(artist)) {
                return res.status(400).json({ message: "Invalid artist id" });
            }
            user = await user_model_1.default.findById(artist);
            if (user) {
                if (user.role !== "ARTIST")
                    return res.status(400).json({ message: "User is not an artist" });
            }
            else {
                return res.status(400).json({ message: "User not found" });
            }
        }
        const newArtwork = new artwork_model_1.default({
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
    }
    catch (error) {
        (0, controllerError_1.internalError)("Error in create artwork controller", error, res);
    }
};
exports.createArtwork = createArtwork;
const getAllArtworks = async (req, res) => {
    try {
        const artworks = await artwork_model_1.default.find().populate({
            path: "artist",
            select: "-password",
        });
        return res
            .status(200)
            .json({ message: "Artworks fetched successfully", data: artworks });
    }
    catch (error) {
        (0, controllerError_1.internalError)("Error in  getAllArtworks controller", error, res);
    }
};
exports.getAllArtworks = getAllArtworks;
const getArtworksByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId || !mongoose_1.default.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ error: "Invalid or missing category id" });
        }
        const artworks = await artwork_model_1.default.find({ category: categoryId }).populate("artist category");
        if (!artworks) {
            return res.status(404).json({ error: "No artworks found" });
        }
        return res.status(200).json({
            message: "Artworks fetched successfully",
            data: artworks,
        });
    }
    catch (error) {
        (0, controllerError_1.internalError)("Error in  getArtworksByCategory controller", error, res);
    }
};
exports.getArtworksByCategory = getArtworksByCategory;
const getArtworkById = async (req, res) => {
    try {
        const artworkId = req.params.id;
        if (!artworkId || !mongoose_1.default.Types.ObjectId.isValid(artworkId)) {
            return res.status(400).json({ message: "Invalid or missing artwork id" });
        }
        const artwork = await artwork_model_1.default.findOne({ _id: artworkId }).populate("artist category");
        if (!artwork) {
            return res.status(404).json({ message: "No artwork found" });
        }
        return res.status(200).json({
            message: "Artwork fetched successfully",
            data: artwork,
        });
    }
    catch (error) {
        (0, controllerError_1.internalError)("Error in  getARtworkById controller", error, res);
    }
};
exports.getArtworkById = getArtworkById;
const updateArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, image, category, artist, availability } = req.body;
        if (category) {
            if (!mongoose_1.default.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ message: "Invalid category id" });
            }
        }
        let user;
        if (artist) {
            if (!mongoose_1.default.Types.ObjectId.isValid(artist)) {
                return res.status(400).json({ message: "Invalid artist id" });
            }
            user = await user_model_1.default.findById(artist);
            if (user) {
                if (user.role !== "ARTIST") {
                    return res.status(400).json({ message: "User is not an artist" });
                }
            }
            else {
                return res.status(400).json({ message: "User not found" });
            }
        }
        const updateFields = {};
        if (title)
            updateFields.title = title;
        if (description)
            updateFields.description = description;
        if (price)
            updateFields.price = price;
        if (image)
            updateFields.image = image;
        if (category)
            updateFields.category = category;
        if (artist)
            updateFields.artist = artist;
        if (typeof availability === "boolean") {
            updateFields.availability = availability;
        }
        const updatedArtwork = await artwork_model_1.default.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
        if (!updatedArtwork) {
            return res.status(404).json({ message: "Artwork not found" });
        }
        return res.status(200).json({
            message: "Artwork updated successfully",
            artwork: updatedArtwork,
        });
    }
    catch (error) {
        (0, controllerError_1.internalError)("Error in  update artwork controller", error, res);
    }
};
exports.updateArtwork = updateArtwork;
const deleteArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Artwork id is required" });
        }
        const result = await artwork_model_1.default.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Couldn't delete artwork" });
        }
        return res.status(202).json({ message: "Artwork deleted successfully" });
    }
    catch (error) {
        (0, controllerError_1.internalError)("Error in  delete artwork controller", error, res);
    }
};
exports.deleteArtwork = deleteArtwork;
const setFeaturedArtwork = async (req, res) => {
    const { artworkId } = req.params;
    try {
        const artwork = await artwork_model_1.default.findById(artworkId);
        if (!artwork) {
            return res.status(404).json({ message: "Artwork not found" });
        }
        const isCurrentlyFeatured = artwork.isFeatured;
        if (!isCurrentlyFeatured) {
            await artwork_model_1.default.updateMany({ isFeatured: true }, { $set: { isFeatured: false } });
        }
        artwork.isFeatured = !isCurrentlyFeatured;
        await artwork.save();
        return res.status(200).json({
            message: `Artwork is now ${artwork.isFeatured ? "featured" : "not featured"}`,
            data: artwork,
        });
    }
    catch (error) {
        (0, controllerError_1.internalError)("Error in  setFeaturedArtwork  controller", error, res);
    }
};
exports.setFeaturedArtwork = setFeaturedArtwork;
const getFeaturedArtwork = async (req, res) => {
    try {
        const featuredArtwork = await artwork_model_1.default.findOne({ isFeatured: true })
            .populate("artist")
            .select("-password");
        if (featuredArtwork) {
            return res
                .status(200)
                .json({ message: "Featured Artwork fetched", data: featuredArtwork });
        }
        return res.status(404).json({ message: "No featured artwork" });
    }
    catch (error) {
        (0, controllerError_1.internalError)("Error in  getFeaturedArtwork  controller", error, res);
    }
};
exports.getFeaturedArtwork = getFeaturedArtwork;
//# sourceMappingURL=artwork.controller.js.map