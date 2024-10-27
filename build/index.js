"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const connectToMongoDB_1 = __importDefault(require("./db/connectToMongoDB"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const artwork_routes_1 = __importDefault(require("./routes/artwork.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://test-pay.khalti.com"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/category", category_routes_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/artwork", artwork_routes_1.default);
app.use("/api/payment", payment_routes_1.default);
app.use("/api/order", order_routes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.listen(port, () => {
    (0, connectToMongoDB_1.default)();
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map