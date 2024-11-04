import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller";
import adminRoute from "../middleware/adminRoute";

const router = Router();

router.get("/", adminRoute, getAnalytics);

export default router;
