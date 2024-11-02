import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getArtists,
  updateUser,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getAllUsers);
router.get("/artists", getArtists);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;
