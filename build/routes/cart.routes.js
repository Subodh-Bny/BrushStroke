"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const cart_controller_1 = require("../controllers/cart.controller");
const router = express_1.default.Router();
router.post("/", protectRoute_1.default, cart_controller_1.addToCart);
router.get("/", protectRoute_1.default, cart_controller_1.getCart);
router.delete("/:id", protectRoute_1.default, cart_controller_1.removeItemFromCart);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map