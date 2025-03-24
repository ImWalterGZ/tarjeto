import express from "express";
import {
  createPromocion,
  getPromociones,
  getPromocionById,
  updatePromocion,
  deletePromocion,
  hardDeletePromocion,
  updatePromocionAnalytics,
  getPromocionStats,
  getPromocionesNegocio,
} from "../controllers/promocion.controller.js";

const router = express.Router();

// CRUD Routes
router.post("/", createPromocion);
router.get("/", getPromociones);
router.get("/stats/:negocioID", getPromocionStats);
router.get("/:negocioID", getPromocionesNegocio);
router.get("/promocion/:id", getPromocionById);
router.put("/:id", updatePromocion);
router.delete("/:id", deletePromocion);

// Additional Routes
router.delete("/:id/hard", hardDeletePromocion); // Admin only route
router.post("/:id/analytics", updatePromocionAnalytics);

export default router;
