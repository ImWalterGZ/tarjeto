import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";
import visitasRoutes from "./routes/visita.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Con esta libreria, CORS, evita los problemas de bloqueo de CORS
// Sirviendo como un acceso de control al servidor, diciendo que las peticiones de
// Servidor de frontend pueden interactuar con el
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json()); // esto nos permite paresear todas las request a jsons
app.use(cookieParser()); // Con esto podemos parsear y tratar las cookies
app.use("/api/auth", authRoutes);
app.use("/api/visita", visitasRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("server is running on port: ", PORT);
});
