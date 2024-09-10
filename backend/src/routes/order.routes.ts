import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

router.post("/", protectRoute, createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id", protectRoute, updateOrder);
router.delete("/:id", protectRoute, deleteOrder);

export default router;
