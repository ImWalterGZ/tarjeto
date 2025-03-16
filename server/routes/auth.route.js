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

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Public routes (no token required)
router.options("*", cors(corsOptions));
router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes (token required)
router.get("/check-auth", verifyToken, checkAuth);
router.post("/logout", verifyToken, logout);
router.post(
  "/setup-profile",
  verifyToken,
  upload.single("fotoPerfil"),
  setupProfile
);

export default router;
