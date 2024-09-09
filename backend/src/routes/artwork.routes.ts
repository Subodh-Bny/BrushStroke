import { Router } from "express";
import {
  createArtwork,
  deleteArtwork,
  getAllArtworks,
  getArtworksByCategory,
  updateArtwork,
} from "../controllers/artwork.controller";

const router = Router();

router.post("/", createArtwork);
router.get("/", getAllArtworks);
router.put("/:id", updateArtwork);
router.delete("/:id", deleteArtwork);
router.get("/category", getArtworksByCategory);
export default router;
