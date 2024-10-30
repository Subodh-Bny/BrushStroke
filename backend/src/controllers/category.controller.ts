import { Response, Request } from "express";
import mongoose from "mongoose";
import Category from "../models/category.model";
import { internalError } from "./controllerError";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Please enter a category name" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    return res.status(201).json({
      message: "Category created successfully",
      data: { name: newCategory.name, id: newCategory._id },
    });
  } catch (error: any) {
    internalError("Error in create category controller", error, res);
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();

    return res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error: any) {
    internalError("Error in getCategory controller", error, res);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Category id is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid category id" });
    }

    if (!name || name === "") {
      return res.status(400).json({ error: "Category name is required" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error: any) {
    internalError("Error in update category controller", error, res);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) {
      return res.status(400).json({ error: "Category id is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid category id" });
    }

    const result = await Category.findOneAndDelete({ _id: id });

    if (!result) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(202).json({ message: "Category deleted successfully" });
  } catch (error: any) {
    internalError("Error in delete category controller", error, res);
  }
};
