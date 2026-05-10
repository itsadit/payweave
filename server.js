import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bodyParser from "body-parser";
import errorHandler from "./middlewares/error.js";
import authRoutes from "./routes/auth.route.js";
import orderRoutes from "./routes/order.route.js";
import webhookRoutes from "./routes/webhook.route.js";

dotenv.config();
await connectDB();

const PORT = process.env.PORT;
const app = express();

app.use(
  "api/webhooks/",
  bodyParser.raw({ type: "application/json" }),
  webhookRoutes,
);
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "hey its working" });
});

app.listen(PORT, () => {
  console.log(`🚀 server is running on ${PORT}`);
});
