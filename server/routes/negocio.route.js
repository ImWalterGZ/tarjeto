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

// Branding and customization routes
router.put("/branding", negocioController.updateBranding);
router.get("/branding", negocioController.getBranding);

// Establishment routes
router.post("/establecimiento", negocioController.addEstablecimiento);
router.put("/establecimiento/:id", negocioController.updateEstablecimiento);
router.delete("/establecimiento/:id", negocioController.deleteEstablecimiento);

export default router;
