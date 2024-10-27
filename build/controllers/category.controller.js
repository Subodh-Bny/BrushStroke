"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getAllCategories = exports.createCategory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const category_model_1 = __importDefault(require("../models/category.model"));
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Please enter a category name" });
        }
        const existingCategory = await category_model_1.default.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ error: "Category already exists" });
        }
        const newCategory = new category_model_1.default({ name });
        await newCategory.save();
        return res.status(201).json({
            message: "Category created successfully",
            data: { name: newCategory.name, id: newCategory._id },
        });
    }
    catch (error) {
        console.error("Error in create category controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.createCategory = createCategory;
const getAllCategories = async (req, res) => {
    try {
        const categories = await category_model_1.default.find();
        return res.status(200).json({
            message: "Categories fetched successfully",
            data: categories,
        });
    }
    catch (error) {
        console.log("Error in getCategory controller", error.message);
        return res.status(500).json({ error: "Internal server erro" });
    }
};
exports.getAllCategories = getAllCategories;
const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;
        if (!id) {
            return res.status(400).json({ error: "Category id is required" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid category id" });
        }
        if (!name || name === "") {
            return res.status(400).json({ error: "Category name is required" });
        }
        const updatedCategory = await category_model_1.default.findByIdAndUpdate(id, { name }, { new: true, runValidators: true });
        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }
        return res.status(200).json({
            message: "Category updated successfully",
            category: updatedCategory,
        });
    }
    catch (error) {
        console.log("Error in update category controller");
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "Category id is required" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid category id" });
        }
        const result = await category_model_1.default.findOneAndDelete({ _id: id });
        if (!result) {
            return res.status(404).json({ error: "Category not found" });
        }
        return res.status(202).json({ message: "Category deleted successfully" });
    }
    catch (error) {
        console.log("Error in delete category controller", error.message);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.controller.js.map