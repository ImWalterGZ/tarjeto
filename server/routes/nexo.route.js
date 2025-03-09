import express from "express";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
// Import your nexo controller here
// import { nexoController } from "../controllers/nexo.controller.js";

const router = express.Router();

// Add your routes here
// Example routes:
// router.post("/register", verifyToken, nexoController.register);
// router.get("/validate", verifyToken, nexoController.validate);
// router.get("/status", verifyToken, nexoController.getStatus);

export default router;
