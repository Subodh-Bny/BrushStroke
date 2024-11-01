import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderByUserId,
  updateShippingStatus,
} from "../controllers/order.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

router.post("/", protectRoute, createOrder);
router.get("/", protectRoute, getAllOrders);
router.get("/:id", protectRoute, getOrderById);
router.get("/user/:userId", protectRoute, getOrderByUserId);
router.put("/:id", protectRoute, updateOrder);
router.delete("/:id", protectRoute, deleteOrder);
router.put(
  "/shipping/status/:orderId/:status",
  protectRoute,
  updateShippingStatus
);

export default router;
