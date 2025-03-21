import express from "express";
import { establecimientoController } from "../controllers/establecimiento.controller.js";

const router = express.Router();

router.post("/generate-code", establecimientoController.generateConnectionCode);
router.post("/", establecimientoController.addEstablecimiento);
router.get("/:id", establecimientoController.getEstablecimiento);
router.put("/:id", establecimientoController.updateEstablecimiento);
router.delete("/:id", establecimientoController.deleteEstablecimiento);
router.post("/:id/unpair", establecimientoController.unpairNexo);
router.get("/:id/nexo", establecimientoController.getNexo);

export default router;
