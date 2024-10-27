"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const router = (0, express_1.Router)();
router.post("/initiateKhalti", protectRoute_1.default, payment_controller_1.initiateKhaltiPayment);
router.post("/verifyKhalti", protectRoute_1.default, payment_controller_1.verifyKhaltiPaymentAndUpdateOrder);
router.post("/generate-esewa-signature", protectRoute_1.default, payment_controller_1.generateEsewaSignature);
exports.default = router;
//# sourceMappingURL=payment.routes.js.map