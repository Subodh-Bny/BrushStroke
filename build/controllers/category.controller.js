"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getAllCategories = exports.createCategory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const category_model_1 = __importDefault(require("../models/category.model"));
const controllerError_1 = require("./controllerError");
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
        (0, controllerError_1.internalError)("Error in create category controller", error, res);
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
        (0, controllerError_1.internalError)("Error in getCategory controller", error, res);
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
        (0, controllerError_1.internalError)("Error in update category controller", error, res);
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
        (0, controllerError_1.internalError)("Error in delete category controller", error, res);
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.controller.js.map