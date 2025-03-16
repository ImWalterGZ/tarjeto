import express from "express";
import multer from "multer";
import {
  login,
  signup,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  setupProfile,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
import cors from "cors";
import { corsOptions } from "../config/cors.config.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Handle OPTIONS requests for all routes
router.options("*", cors(corsOptions));

// Public routes (no token required)
router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes (token required)
router.get(
  "/check-auth",
  (req, res, next) => {
    console.log("\n=== check-auth request ===");
    console.log("Method:", req.method);
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Host:", req.headers.host);

    if (req.method === "OPTIONS") {
      console.log("Handling OPTIONS request in check-auth route");
      res.header("Access-Control-Allow-Origin", req.headers.origin);
      res.header("Access-Control-Allow-Methods", "GET,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type,Authorization,Access-Control-Allow-Credentials"
      );
      res.header("Access-Control-Allow-Credentials", "true");
      res.status(204).end();
      return;
    }
    next();
  },
  cors(corsOptions),
  verifyToken,
  checkAuth
);
router.post("/logout", verifyToken, logout);
router.post(
  "/setup-profile",
  verifyToken,
  upload.single("fotoPerfil"),
  setupProfile
);

export default router;
