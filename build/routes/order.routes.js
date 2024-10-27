"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const router = express_1.default.Router();
router.post("/", protectRoute_1.default, order_controller_1.createOrder);
router.get("/", protectRoute_1.default, order_controller_1.getAllOrders);
router.get("/:id", protectRoute_1.default, order_controller_1.getOrderById);
router.get("/user/:userId", protectRoute_1.default, order_controller_1.getOrderByUserId);
router.put("/:id", protectRoute_1.default, order_controller_1.updateOrder);
router.delete("/:id", protectRoute_1.default, order_controller_1.deleteOrder);
exports.default = router;
//# sourceMappingURL=order.routes.js.map