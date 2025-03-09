import express from "express";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
import { clienteController } from "../controllers/cliente.controller.js";
// Import your cliente controller here
// import { clienteController } from "../controllers/cliente.controller.js";

const router = express.Router();

// Add your routes here
// Example routes:
// router.get("/profile", verifyToken, clienteController.getProfile);
// router.put("/profile", verifyToken, clienteController.updateProfile);
// router.get("/visits", verifyToken, clienteController.getVisits);

router.post("/setup-profile", verifyToken, clienteController.setupProfile);

export default router; // This is the important part - the default export
