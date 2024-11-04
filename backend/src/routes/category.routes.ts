import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/category.controller";
import adminRoute from "../middleware/adminRoute";

const router = Router();

router.get("/", getAllCategories);
router.post("/create", adminRoute, createCategory);
router.put("/:id", adminRoute, updateCategory);
router.delete("/:id", adminRoute, deleteCategory);

export default router;
