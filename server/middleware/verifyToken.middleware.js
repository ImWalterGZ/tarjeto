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

  // Check mobile-auth header (custom header for mobile clients)
  const mobileAuthHeader = req.headers["mobile-auth"];
  // Check standard Authorization header
  const authHeader = req.headers.authorization;
  let token = null;
  let tokenSource = null;

  if (mobileAuthHeader && mobileAuthHeader.startsWith("Bearer ")) {
    token = mobileAuthHeader.split(" ")[1]; // Extract token after "Bearer "
    tokenSource = "mobile-auth header";
  } else if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]; // Extract token after "Bearer "
    tokenSource = "authorization header";
  } else {
    // Fallback to cookies (for web)
    token = req.cookies?.token;
    tokenSource = "cookies";
  }

  console.log("Token source:", tokenSource);
  console.log("Token found:", token ? "Yes" : "No token");

  if (!token) {
    console.log("No token found in either Authorization header or cookies");
    return res
      .status(401)
      .json({ success: false, message: "Sin autorizacion, no hay token" });
  }

  try {
    console.log("Verifying token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully");
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
