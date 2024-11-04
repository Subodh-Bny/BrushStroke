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
import adminRoute from "../middleware/adminRoute";

const router = Router();

router.post("/", adminRoute, createArtwork);
router.get("/", getAllArtworks);
router.get("/:id", getArtworkById);
router.put("/:id", adminRoute, updateArtwork);
router.delete("/:id", adminRoute, deleteArtwork);
router.get("/category/:categoryId", getArtworksByCategory);
router.patch(
  "/featured/:artworkId/toggle-featured",
  adminRoute,
  setFeaturedArtwork
);
router.get("/featured/get", getFeaturedArtwork);
export default router;
