import { Router } from "express";
import {
  generateEsewaSignature,
  initiateKhaltiPayment,
  verifyKhaltiPaymentAndUpdateOrder,
} from "../controllers/payment.controller";
import protectRoute from "../middleware/protectRoute";

const router = Router();

router.post("/initiateKhalti", protectRoute, initiateKhaltiPayment);
router.post("/verifyKhalti", protectRoute, verifyKhaltiPaymentAndUpdateOrder);
router.post("/generate-esewa-signature", protectRoute, generateEsewaSignature);

export default router;
