export const corsOptions = {
  origin: [
    "https://www.tarjeto.app",
    "https://tarjeto.app",
    "tarjeto.app",
    "www.tarjeto.app",
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cookie",
    "Access-Control-Allow-Credentials",
  ],
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400,
};
