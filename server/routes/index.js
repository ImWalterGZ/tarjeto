import express from "express";
import authRoutes from "./auth.route.js";
import negocioRoutes from "./negocio.route.js";
import clienteRoutes from "./cliente.route.js";
import nexoRoutes from "./nexo.route.js";
import visitaRoutes from "./visita.route.js";
import promocionRoutes from "./promocion.route.js";
const router = express.Router();

// API routes
router.use("/auth", authRoutes);
router.use("/negocio", negocioRoutes);
router.use("/cliente", clienteRoutes);
router.use("/nexo", nexoRoutes);
router.use("/visitas", visitaRoutes);
router.use("/promociones", promocionRoutes);
export default router;
