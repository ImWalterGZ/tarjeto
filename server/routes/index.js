import express from "express";
import authRoutes from "./auth.route.js";
import negocioRoutes from "./negocio.route.js";
import clienteRoutes from "./cliente.route.js";
import mobileRoutes from "./mobile.route.js";
import nexoRoutes from "./nexo.route.js";
import visitaRoutes from "./visita.route.js";
import promocionRoutes from "./promocion.route.js";
import programaLealtadRoutes from "./programaLealtad.route.js";
import establecimientoRoutes from "./establecimiento.route.js";

const router = express.Router();

// API routes
router.use("/auth", authRoutes);
router.use("/negocio", negocioRoutes);
router.use("/cliente", clienteRoutes);
router.use("/mobile", mobileRoutes);
router.use("/nexo", nexoRoutes);
router.use("/visita", visitaRoutes);
router.use("/promocion", promocionRoutes);
router.use("/programa-lealtad", programaLealtadRoutes);
router.use("/establecimiento", establecimientoRoutes);

export default router;
