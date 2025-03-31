import express from "express";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
import { clienteController } from "../controllers/cliente.controller.js";
// Import your cliente controller here
// import { clienteController } from "../controllers/cliente.controller.js";

const router = express.Router();

// Apply verifyToken middleware to all client routes
router.use(verifyToken);

// Profile routes
router.get("/profile", clienteController.getProfile);
router.put("/profile", clienteController.updateProfile);

// Client data route - for mobile app startup
router.get("/data", clienteController.getClientData);

// Cards routes
router.get("/tarjetas", clienteController.getCards);

// Promotions routes
router.get("/promociones", clienteController.getPromotions);

// Visits routes
router.get("/visitas", clienteController.getVisits);
router.post("/visitas", clienteController.registrarVisita);

export default router; // This is the important part - the default export
