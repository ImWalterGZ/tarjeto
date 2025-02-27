import express from "express";

import { registrarVisita } from "../controllers/visita.controller.js";

const router = express.Router();

router.post("/registrarVisita", registrarVisita);

export default router;
