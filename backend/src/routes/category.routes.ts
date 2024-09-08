import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/category.controller";

const router = Router();

router.get("/", getAllCategories);
router.post("/create", createCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
