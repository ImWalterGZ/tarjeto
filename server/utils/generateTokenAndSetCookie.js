import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (
  res,
  userId,
  isMobileClient = false
) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // For web clients, set the cookie
  if (!isMobileClient) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 24 * 60 * 60 * 1000,
      path: "/",
      domain:
        process.env.NODE_ENV === "production" ? ".tarjeto.app" : undefined,
    });
  }

  return token;
};
