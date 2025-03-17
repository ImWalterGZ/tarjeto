import express from "express";
import { establecimientoController } from "../controllers/establecimiento.controller.js";

const router = express.Router();

// Protected routes (require authentication)

router.post("/generate-code", establecimientoController.generateConnectionCode);
router.post("/", establecimientoController.addEstablecimiento);
router.get("/:id", establecimientoController.getEstablecimiento);
router.put("/:id", establecimientoController.updateEstablecimiento);
router.delete("/:id", establecimientoController.deleteEstablecimiento);

export default router;
