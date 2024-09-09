import express, { Express, Response, Request } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectToMongoDB from "./db/connectToMongoDB";

import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import userRoutes from "./routes/user.routes";
import artwork from "./routes/artwork.routes";

dotenv.config();

const app: Express = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/artwork", artwork);

app.listen(port, () => {
  connectToMongoDB();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
