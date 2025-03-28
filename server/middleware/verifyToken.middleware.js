import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("\n=== verifyToken Middleware ===");
  console.log("Request URL:", req.originalUrl);
  console.log("Method:", req.method);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));

  // Skip token verification for OPTIONS requests
  if (req.method === "OPTIONS") {
    console.log("Skipping token verification for OPTIONS request");
    return next();
  }

  let token = null;
  let tokenSource = null;

  // Check Authorization header first (for mobile)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]; // Extract token after "Bearer "
    tokenSource = "Authorization header";
  }

  // Only check cookies if no token in Authorization header
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
    tokenSource = "cookies";
  }

  console.log("Token source:", tokenSource);
  console.log(
    "Token found:",
    token ? `${token.substring(0, 20)}...` : "No token"
  );

  if (!token) {
    console.log("No token found in either Authorization header or cookies");
    return res
      .status(401)
      .json({ success: false, message: "Sin autorizacion, no hay token" });
  }

  try {
    console.log("Attempting to verify token...");
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    console.log("JWT_SECRET length:", process.env.JWT_SECRET?.length);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully");
    console.log("Decoded token payload:", decoded);
    // Set both userId and user object for compatibility
    req.userId = decoded.userId;
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
      error: error.message,
    });
  }
};
