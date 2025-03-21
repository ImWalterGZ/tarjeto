import express from "express";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
import { nexoController } from "../controllers/nexo.controller.js";

const router = express.Router();

// Public route for Nexo device registration
router.post("/register", nexoController.register);

// Protected route for getting Nexo status
router.get("/:nexoId/status", nexoController.getStatus);

// Add new route for Nexo statistics
router.get("/:nexoId/stats", nexoController.getNexoStats);

router.get(
  "/datosCliente/:clienteId/:establecimientoID",
  nexoController.getClienteData
);
router.post("/registrarVisita", nexoController.registrarVisita);
router.post("/crearTarjetaNueva", nexoController.crearTarjetaNueva);
// Add your routes here
// Example routes:
// router.post("/register", verifyToken, nexoController.register);
// router.get("/validate", verifyToken, nexoController.validate);
// router.get("/status", verifyToken, nexoController.getStatus);

export default router;
