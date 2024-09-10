import { Router } from "express";
import {
  createArtwork,
  deleteArtwork,
  getAllArtworks,
  getArtworksByCategory,
  updateArtwork,
} from "../controllers/artwork.controller";
import protectRoute from "../middleware/protectRoute";

const router = Router();

router.post("/", protectRoute, createArtwork);
router.get("/", getAllArtworks);
router.put("/:id", protectRoute, updateArtwork);
router.delete("/:id", protectRoute, deleteArtwork);
router.get("/category", getArtworksByCategory);
export default router;
