import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Sin autorizacion, no hay token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
