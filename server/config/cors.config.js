export const corsOptions = {
  origin: function (origin, callback) {
    const productionOrigins = [
      "https://tarjeto-kn2iwbb4k-imwaltergzs-projects.vercel.app",
      "https://tarjeto.app",
      "https://www.tarjeto.app",
      "https://tarjeto.vercel.app",
    ];

    const developmentOrigins = ["http://localhost:5173"];

    const allowedOrigins =
      process.env.NODE_ENV === "production"
        ? productionOrigins
        : developmentOrigins;

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
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
  maxAge: 86400, // 24 hours
};
