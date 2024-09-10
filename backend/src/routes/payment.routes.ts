import { Router } from "express";
import {
  initiatePayment,
  verifyPaymentAndUpdateOrder,
} from "../controllers/payment.controller";
import protectRoute from "../middleware/protectRoute";

const router = Router();

router.post("/initiate", protectRoute, initiatePayment);
router.post("/verify", protectRoute, verifyPaymentAndUpdateOrder);

export default router;
