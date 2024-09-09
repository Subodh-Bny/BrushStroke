import { Router } from "express";
import {
  createArtwork,
  deleteArtwork,
  getAllArtworks,
  updateArtwork,
} from "../controllers/artwork.controller";

const router = Router();

router.post("/", createArtwork);
router.get("/", getAllArtworks);
router.put("/:id", updateArtwork);
router.delete("/:id", deleteArtwork);

export default router;
