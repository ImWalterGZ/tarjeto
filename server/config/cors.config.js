export const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://www.tarjeto.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
