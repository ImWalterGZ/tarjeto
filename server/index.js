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
import { initializeSeasonProcessor } from "./services/programaLealtad.service.js";

// Load env vars
dotenv.config();

const app = express();
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

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
    // Initialize season processor after DB connection
    initializeSeasonProcessor();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Middleware

app.use(cookieParser());
app.use(express.json());
app.use(limiter);

// Routes
app.use("/api", router);
app.use("/", (req, res) => {
  res.send("Hello World");
});
app.get("/api/test", (req, res) => {
  res.send("Hello World");
});
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
