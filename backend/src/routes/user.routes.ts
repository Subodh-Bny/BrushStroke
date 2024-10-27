import { Router } from "express";
import { getAllUsers, getArtists } from "../controllers/user.controller";

const router = Router();

router.get("/", getAllUsers);
router.get("/artists", getArtists);

export default router;
