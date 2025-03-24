import dotenv from "dotenv";
console.log("Loading environment variables...");
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { corsOptions } from "./config/cors.config.js";
import connectDB from "./config/db.js";

import { initializeSeasonProcessor } from "./services/programaLealtad.service.js";

// Load env vars

const app = express();

// Request logging middleware - must be first
app.use((req, res, next) => {
  // Handle www subdomain redirect
  const host = req.headers.host;
  if (
    host?.startsWith("www.") &&
    req.method !== "OPTIONS" &&
    !req.originalUrl.startsWith("/api")
  ) {
    console.log("Removing www from host:", host);
    const newHost = host.replace("www.", "");
    const newUrl = `${req.protocol}://${newHost}${req.originalUrl}`;
    console.log("Redirecting to:", newUrl);
    return res.redirect(301, newUrl);
  }

  // Log response
  const oldWrite = res.write;
  const oldEnd = res.end;

  const chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);
    return oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) chunks.push(chunk);

    oldEnd.apply(res, arguments);
  };

  next();
});

// CORS configuration - must be before any route handlers
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Security headers middleware
app.use((req, res, next) => {
  // Remove browsing-topics from Permissions-Policy
  res.setHeader(
    "Permissions-Policy",
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
  );
  next();
});

// Security middleware
app.use((req, res, next) => {
  // console.log("\n=== CORS Preflight Check ===");
  // console.log("Is OPTIONS request:", req.method === "OPTIONS");
  // console.log("Origin:", req.headers.origin);
  // console.log(
  //   "Access-Control-Request-Method:",
  //   req.headers["access-control-request-method"]
  // );
  // console.log(
  //   "Access-Control-Request-Headers:",
  //   req.headers["access-control-request-headers"]
  // );
  // console.log("========================\n");

  // Prevent redirects on OPTIONS requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request - sending 204");
    res.status(204).end();
    return;
  }
  next();
});

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

// Routes
app.use("/api", router);

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Serve static frontend for non-API routes
app.use("/", (req, res) => {
  res.send("Hello World");
});

// Error handling
app.use(errorHandler);

// 404 handler for all other routes
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
