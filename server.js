import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import contactRoutes from "./routes/contact.js";
import projectRoutes from "./routes/projects.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

/* ===== MIDDLEWARE ===== */
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Global rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

/* ===== ROUTES ===== */
app.use("/api/contact", contactRoutes);
app.use("/api/projects", projectRoutes);

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok", ts: Date.now() }));

/* ===== SERVE FRONTEND (production) ===== */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend")));
  app.get("*", (_req, res) =>
    res.sendFile(path.join(__dirname, "../frontend/index.html"))
  );
}

/* ===== ERROR HANDLER ===== */
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ===== DB + START ===== */
mongoose
  .connect(process.env.MONGO_URI, { dbName: "portfolio" })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });

export default app;
