import bcrypt from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { codigoVerificacion } from "../utils/generarCodigoVerificacion.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";

export const login = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res
        .status(400)
        .json({ succes: false, message: "Invalid credentials" });
    }
    const contrasenaEsValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena
    );
    if (!contrasenaEsValida) {
      return res
        .status(400)
        .json({ success: false, message: "Contrasena invalida" });
    }
    generateTokenAndSetCookie(res, usuario._id);
    usuario.ultimaConexion = new Date();

    await usuario.save();

    res.status(200).json({
      success: true,
      message: "Log exitoso",
      user: {
        ...usuario._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Ocurrió un error en la funcion login");
    res.status(400).json({ success: false, message: error.message });
  }
};
export const signup = async (req, res) => {
  const { email, contrasena, nombre } = req.body;

  try {
    if (!email || !contrasena || !nombre) {
      throw new Error("Todos los campos son requeridos");
    }

    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return res
        .status(400)
        .json({ success: false, message: "El usuario ya existe" });
    }
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const verificationToken = codigoVerificacion();

    const user = new User({
      email,
      contrasena: hashedPassword,
      nombre,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    await user.save();

    // JWT
    generateTokenAndSetCookie(res, user._id);

    sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "Usuario creado con exito",
      user: {
        ...user._doc,
        contrasena: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res
        .status(400)
        .json({ success: false, message: "Usuario no existe" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hora
    usuario.resetPasswordToken = resetToken;
    usuario.resetPasswordExpiresAt = resetTokenExpiresAt;
    await usuario.save();

    await sendPasswordResetEmail(
      usuario.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: `Email enviado `,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Codigo invalido o codigo expirado" });
    }
    user.verificado = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.nombre);
    res.status(200).json({
      success: true,
      message: `Email verificado correctamente, ${user.name}`,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ sucess: true, message: "loggeado fuera con exito" });
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { contrasena } = req.body;
    const usuario = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!usuario) {
      return res
        .status(400)
        .json({ sucess: false, message: "Invalido o token expirado" });
    }
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    usuario.contrasena = hashedPassword;
    usuario.resetPasswordExpiresAt = undefined;
    usuario.resetPasswordToken = undefined;
    await usuario.save();

    await sendResetSuccessEmail(usuario.email);

    res
      .status(200)
      .json({ success: true, message: "Contrasena cambiada correctamente" });
  } catch (error) {
    console.log("algo paso carnal", error);
    res.status(400).json({
      success: false,
      message: "Todo mal con el reseteo de contrasena",
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const usuario = await User.findOne(req.userId);
    if (!usuario) {
      return res
        .status(400)
        .json({ success: false, message: "Usuario no encontrado" });
    }
    res.status(200).json({
      success: true,
      usuario: {
        ...usuario._doc,
        contrasena: undefined,
      },
    });
  } catch (error) {
    console.log("Error con checkAuth ", error);
    res.status(400).json({ success: false, message: ("pues ", error.message) });
  }
};
