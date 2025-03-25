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
router.get("/cards", clienteController.getCards);

// Promotions routes
router.get("/promotions", clienteController.getPromotions);

// Visits routes
router.get("/visits", clienteController.getVisits);
router.post("/visits", clienteController.registrarVisita);

export default router; // This is the important part - the default export
