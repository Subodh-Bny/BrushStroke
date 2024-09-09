import { Router } from "express";
import { initiatePayment, verifyPayment } from "../khalti/payment.controller";

const router = Router();

router.post("/initiate", initiatePayment);
router.post("/verify", verifyPayment);

export default router;
