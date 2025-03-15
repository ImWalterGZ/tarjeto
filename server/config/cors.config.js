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

    console.log("\n=== CORS Request Debug ===");
    console.log("1. Environment Info:");
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    console.log("- PORT:", process.env.PORT);
    console.log("- HOST:", process.env.HOST);

    console.log("\n2. Request Details:");
    console.log("- Origin:", origin);
    console.log("- Type:", typeof origin);
    console.log("- Headers:", JSON.stringify(arguments[2]?.headers, null, 2));
    console.log("- URL:", arguments[2]?.url);
    console.log("- Method:", arguments[2]?.method);

    console.log("\n3. CORS Configuration:");
    console.log("- Allowed Origins:", allowedOrigins);
    console.log(
      "- Is Origin in Allowed List:",
      allowedOrigins.includes(origin)
    );
    console.log("========================\n");

    // During debugging, log the full request object (but clean it first)
    const debugReq = arguments[2] ? { ...arguments[2] } : null;
    if (debugReq) {
      delete debugReq.socket;
      delete debugReq._readableState;
      delete debugReq._writableState;
      console.log("Full Request Object:", JSON.stringify(debugReq, null, 2));
    }

    // For now, allow the request if it's from our known origins or has no origin
    if (!origin) {
      console.log("No origin provided - allowing request");
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log("Origin explicitly allowed:", origin);
      return callback(null, true);
    }

    // During debugging, we'll allow any origin but log it
    console.log("WARNING: Allowing unknown origin during debugging:", origin);
    return callback(null, true);
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
