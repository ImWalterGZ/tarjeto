import express from "express";
import multer from "multer";
import cors from "cors";
import { corsOptions } from "../config/cors.config.js";
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

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Public routes (no token required)
router.options("*", cors(corsOptions));
router.post("/signup", cors(corsOptions), signup);
router.post("/login", cors(corsOptions), login);
router.post("/verify-email", cors(corsOptions), verifyEmail);
router.post("/forgot-password", cors(corsOptions), forgotPassword);
router.post("/reset-password/:token", cors(corsOptions), resetPassword);

// Protected routes (token required)
router.get("/check-auth", cors(corsOptions), verifyToken, checkAuth);
router.post("/logout", cors(corsOptions), verifyToken, logout);
router.post(
  "/setup-profile",
  verifyToken,
  upload.single("fotoPerfil"),
  setupProfile
);

export default router;
