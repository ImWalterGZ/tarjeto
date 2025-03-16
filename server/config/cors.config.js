export const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://www.tarjeto.app",
      "https://tarjeto.app",
      "http://localhost:5173",
      "https://api.tarjeto.app",
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cookie",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
  ],
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 204,
  preflightContinue: false,
  maxAge: 86400, // 24 hours
  handlePreflightRequest: (req, res) => {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": req.headers.origin,
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Max-Age": 86400,
    });
    res.end();
  },
};
