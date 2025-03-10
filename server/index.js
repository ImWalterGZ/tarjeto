import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { corsOptions } from "./config/cors.config.js";
import { limiter } from "./middleware/rateLimit.middleware.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

const app = express();

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("MongoDB connection established successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(limiter);

// Routes
app.use("/api", router);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

const PORT = process.env.PORT || 5050;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Environment:", process.env.NODE_ENV || "development");
  console.log("MongoDB URI:", process.env.MONGO_URI || "not set");
  console.log("Client URL:", process.env.CLIENT_URL || "http://localhost:5173");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});
