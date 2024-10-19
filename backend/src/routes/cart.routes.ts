import express from "express";

import protectRoute from "../middleware/protectRoute";
import {
  getCart,
  addToCart,
  removeItemFromCart,
} from "../controllers/cart.controller";

const router = express.Router();

router.post("/", protectRoute, addToCart);
router.get("/", protectRoute, getCart);
router.delete("/:id", protectRoute, removeItemFromCart);

export default router;
