import express, { Express, Response, Request } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectToMongoDB from "./db/connectToMongoDB";

import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import userRoutes from "./routes/user.routes";
import artworkRoutes from "./routes/artwork.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import cartRoutes from "./routes/cart.routes";
import analyticsRoutes from "./routes/analytics.routes";

dotenv.config();

const app: Express = express();

const port = process.env.PORT || 5000;
//, "https://test-pay.khalti.com"
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/artwork", artworkRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(port, () => {
  connectToMongoDB();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
