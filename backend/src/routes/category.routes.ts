import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/category.controller";
import protectRoute from "../middleware/protectRoute";

const router = Router();

router.get("/", getAllCategories);
router.post("/create", protectRoute, createCategory);
router.put("/:id", protectRoute, updateCategory);
router.delete("/:id", protectRoute, deleteCategory);

export default router;
