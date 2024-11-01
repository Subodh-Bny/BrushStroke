import { Router } from "express";
import {
  getAllUsers,
  getArtists,
  updateUser,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getAllUsers);
router.get("/artists", getArtists);
router.put("/:userId", updateUser);

export default router;
