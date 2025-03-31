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

// Route to check if a nexo is still linked to an establecimiento
router.get("/:establecimientoID/isLinked", nexoController.checkNexoLinked);

router.get(
  "/datosCliente/:clienteId/:establecimientoID",
  nexoController.getClienteData
);
router.post("/registrarVisita", nexoController.registrarVisita);
router.post("/crearTarjetaNueva", nexoController.crearTarjetaNueva);
router.get("/conectarSensor", nexoController.conectarSensor);
router.get(
  "/promocionUsuario/:clienteID/:establecimientoID",
  nexoController.getPromocionUsuario
);
router.post(
  "/canjearPromocion/:promocionID/:clienteID/:establecimientoID",
  nexoController.canjearPromocion
);

// Ruta para obtener mensajes de pantalla
router.get(
  "/mensajePantalla/:establecimientoID",
  nexoController.obtenerMensajePantalla
);
router.post("/imprimirPromocion", nexoController.postImpresoraPromocion);
router.get(
  "/imprimirPromocion/:establecimientoID",
  nexoController.getImpresiones
);

export default router;
