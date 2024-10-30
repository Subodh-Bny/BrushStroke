import { Router } from "express";
import {
  createArtwork,
  deleteArtwork,
  getAllArtworks,
  getArtworkById,
  getArtworksByCategory,
  getFeaturedArtwork,
  setFeaturedArtwork,
  updateArtwork,
} from "../controllers/artwork.controller";
import protectRoute from "../middleware/protectRoute";

const router = Router();

router.post("/", protectRoute, createArtwork);
router.get("/", getAllArtworks);
router.get("/:id", getArtworkById);
router.put("/:id", protectRoute, updateArtwork);
router.delete("/:id", protectRoute, deleteArtwork);
router.get("/category/:categoryId", getArtworksByCategory);
router.patch(
  "/featured/:artworkId/toggle-featured",
  protectRoute,
  setFeaturedArtwork
);
router.get("/featured/get", getFeaturedArtwork);
export default router;
