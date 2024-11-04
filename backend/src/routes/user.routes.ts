import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getArtists,
  updateUser,
} from "../controllers/user.controller";
import adminRoute from "../middleware/adminRoute";
import protectRoute from "../middleware/protectRoute";

const router = Router();

router.get("/", adminRoute, getAllUsers);
router.get("/artists", protectRoute, getArtists);
router.put("/:userId", protectRoute, updateUser);
router.delete("/:userId", adminRoute, deleteUser);

export default router;
