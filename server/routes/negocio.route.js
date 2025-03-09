import express from "express";
import { negocioController } from "../controllers/negocio.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";

const router = express.Router();

// Apply verifyToken middleware to all business routes
router.use(verifyToken);

// Business profile routes
router.get("/profile", negocioController.getProfile);
router.put("/profile", negocioController.updateProfile);
router.get("/statistics", negocioController.getStatistics);

export default router;
