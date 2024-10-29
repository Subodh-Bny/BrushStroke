import { Router } from "express";
import {
  generateEsewaSignature,
  getPaymentDetails,
  initiateKhaltiPayment,
  verifyKhaltiPaymentAndUpdateOrder,
} from "../controllers/payment.controller";
import protectRoute from "../middleware/protectRoute";

const router = Router();

router.post("/initiateKhalti", protectRoute, initiateKhaltiPayment);
router.post("/verifyKhalti", protectRoute, verifyKhaltiPaymentAndUpdateOrder);
router.post("/generate-esewa-signature", protectRoute, generateEsewaSignature);
router.get("/details", protectRoute, getPaymentDetails);

export default router;
