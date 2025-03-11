import express from "express";
import {
  registrarVisita,
  getVisitasByNegocio,
  getVisitasByCliente,
  getVisitasStats,
  getTraficoHorario,
} from "../controllers/visita.controller.js";

const router = express.Router();

// Register a new visit
router.post("/", registrarVisita);

// Get visits by business with optional date range
router.get("/negocio/:negocioID", getVisitasByNegocio);

// Get visits by client with optional date range
router.get("/cliente/:clienteID", getVisitasByCliente);

// Get visit statistics for a business
router.get("/stats/:negocioID", getVisitasStats);

// Get hourly traffic patterns for a business
router.get("/trafico/:negocioID", getTraficoHorario);

export default router;
