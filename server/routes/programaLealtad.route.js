import express from "express";
import { programaLealtadController } from "../controllers/programaLealtad.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";

const router = express.Router();

// Apply authentication middleware
router.use(verifyToken);

// CRUD Routes
router.post("/", programaLealtadController.crear);
router.get("/negocio/:negocioID", programaLealtadController.obtener);
router.put("/:programaID", programaLealtadController.actualizar);

// Program Management Routes
router.post(
  "/:programaID/promocion/:promocionID",
  programaLealtadController.asignarPromocion
);
router.post(
  "/:programaID/fin-temporada",
  programaLealtadController.procesarFinTemporada
);
router.get(
  "/:programaID/estadisticas/:temporadaID",
  programaLealtadController.obtenerEstadisticas
);
router.post("/evaluar-nivel", programaLealtadController.evaluarNivelCliente);

export default router;
