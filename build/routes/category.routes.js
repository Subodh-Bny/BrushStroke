"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const router = (0, express_1.Router)();
router.get("/", category_controller_1.getAllCategories);
router.post("/create", protectRoute_1.default, category_controller_1.createCategory);
router.put("/:id", protectRoute_1.default, category_controller_1.updateCategory);
router.delete("/:id", protectRoute_1.default, category_controller_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=category.routes.js.map