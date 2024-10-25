import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderByUserId,
} from "../controllers/order.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

router.post("/", protectRoute, createOrder);
router.get("/", protectRoute, getAllOrders);
router.get("/:id", protectRoute, getOrderById);
router.get("/user/:userId", protectRoute, getOrderByUserId);
router.put("/:id", protectRoute, updateOrder);
router.delete("/:id", protectRoute, deleteOrder);

export default router;
