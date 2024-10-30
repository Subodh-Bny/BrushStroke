import { Router } from "express";
import protectRoute from "../middleware/protectRoute";
import { getAnalytics } from "../controllers/analytics.controller";

const router = Router();

router.get("/", protectRoute, getAnalytics);

export default router;
