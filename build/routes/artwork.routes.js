"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const artwork_controller_1 = require("../controllers/artwork.controller");
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const router = (0, express_1.Router)();
router.post("/", protectRoute_1.default, artwork_controller_1.createArtwork);
router.get("/", artwork_controller_1.getAllArtworks);
router.get("/:id", artwork_controller_1.getArtworkById);
router.put("/:id", protectRoute_1.default, artwork_controller_1.updateArtwork);
router.delete("/:id", protectRoute_1.default, artwork_controller_1.deleteArtwork);
router.get("/category/:categoryId", artwork_controller_1.getArtworksByCategory);
router.patch("/featured/:artworkId/toggle-featured", protectRoute_1.default, artwork_controller_1.setFeaturedArtwork);
router.get("/featured/get", artwork_controller_1.getFeaturedArtwork);
exports.default = router;
//# sourceMappingURL=artwork.routes.js.map