import express from "express";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
import { mobileController } from "../controllers/mobile.controller.js";
// Import your cliente controller here
// import { clienteController } from "../controllers/cliente.controller.js";

const router = express.Router();

// Apply verifyToken middleware to all client routes
router.use(verifyToken);

// Profile routes
router.get("/profile/:userId", mobileController.getProfile);
router.get("/otrosNegocios/:userId", mobileController.getOtrosNegocios);
router.get("/tarjetas/:userId", mobileController.getTarjetas);
export default router; // This is the important part - the default export
