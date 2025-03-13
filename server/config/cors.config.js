export const corsOptions = {
  origin: [
    "https://www.tarjeto.app",
    "https://tarjeto-e5ygjg0c5-imwaltergzs-projects.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
