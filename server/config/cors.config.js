export const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://www.tarjeto.app",
      "https://tarjeto.app",
      "http://localhost:5173",
      "https://www.api.tarjeto.app", // Primary API domain
      "https://api.tarjeto.app", // Keep this as fallback
    ];

    // console.log("\n=== CORS Origin Check ===");
    // console.log("Request Origin:", origin);
    // console.log("Request Protocol:", origin?.split("://")[0]);
    // console.log("Request Host:", origin?.split("://")[1]);
    // console.log("Allowed Origins:", allowedOrigins);
    // console.log("Full Request URL:", this?.req?.url);
    // console.log("Headers:", JSON.stringify(this?.req?.headers, null, 2));

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      // console.log("Origin allowed:", origin || "no origin");
      callback(null, true);
    } else {
      // console.log("Origin blocked:", origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Cliente",
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cookie",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Credentials",
  ],
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 204,
  preflightContinue: false,
  maxAge: 86400, // 24 hours
};
