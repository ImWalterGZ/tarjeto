export const corsOptions = {
  origin: ["https://www.tarjeto.app", "https://tarjeto.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cookie",
  ],
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400,
};
