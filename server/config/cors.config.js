export const corsOptions = {
  origin: function (origin, callback) {
    const productionOrigins = [
      "https://tarjeto-kn2iwbb4k-imwaltergzs-projects.vercel.app",
      "https://tarjeto.app",
      "https://www.tarjeto.app",
      "https://tarjeto.vercel.app",
      "https://api.tarjeto.app",
    ];

    const developmentOrigins = ["http://localhost:5173"];

    const allowedOrigins =
      process.env.NODE_ENV === "production"
        ? productionOrigins
        : developmentOrigins;

    console.log("CORS Debug Info (Detailed):");
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    console.log("- Request origin:", origin);
    console.log(
      "- Request headers:",
      JSON.stringify(arguments[2]?.headers, null, 2)
    );
    console.log("- Allowed origins:", allowedOrigins);
    console.log("- Is origin allowed:", allowedOrigins.includes(origin));

    // Allow requests with no origin (like mobile apps, curl requests, or same-origin)
    if (!origin || origin === "null") {
      const isSameOrigin =
        arguments[2]?.headers?.host?.includes("api.tarjeto.app");
      console.log("- No origin or null origin. Is same origin?", isSameOrigin);
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log("- Origin explicitly allowed:", origin);
      callback(null, true);
    } else {
      console.log("- Origin blocked:", origin);
      console.log("- Expected one of:", allowedOrigins);
      callback(new Error(`Not allowed by CORS: ${origin}`));
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
