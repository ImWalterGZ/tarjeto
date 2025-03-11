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
import { Negocio } from "../models/negocio.model.js";
import { Cliente } from "../models/cliente.model.js";

export const login = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    console.log("Intento de login para:", email);
    const usuario = await User.findOne({ email });

    if (!usuario) {
      console.log("Usuario no encontrado:", email);
      return res
        .status(400)
        .json({ success: false, message: "Credenciales inválidas" });
    }

    console.log("Verificando contraseña para usuario:", usuario.email);
    const contrasenaEsValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena
    );

    if (!contrasenaEsValida) {
      console.log("Contraseña inválida para usuario:", email);
      return res
        .status(400)
        .json({ success: false, message: "Contraseña inválida" });
    }

    const token = generateTokenAndSetCookie(res, usuario._id);
    console.log("Token generado para usuario:", email);

    usuario.ultimaConexion = new Date();
    await usuario.save();

    console.log("Login exitoso para usuario:", email);
    res.status(200).json({
      success: true,
      message: "Login exitoso",
      user: {
        ...usuario._doc,
        contrasena: undefined,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
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

    await sendVerificationEmail(user.email, verificationToken);

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
    console.log("Verificando código:", code);
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    console.log("Usuario encontrado en verifyEmail:", user);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Codigo invalido o codigo expirado" });
    }
    user.verificado = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // Generar token JWT y establecer cookie
    const token = generateTokenAndSetCookie(res, user._id);
    console.log("Token generado:", token);

    await sendWelcomeEmail(user.email, user.nombre);
    res.status(200).json({
      success: true,
      message: `Email verificado correctamente, ${user.nombre}`,
      token,
      user: {
        ...user._doc,
        contrasena: undefined,
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
    console.log("ID de usuario en checkAuth:", req.userId);
    const usuario = await User.findOne({ _id: req.userId });
    console.log("Usuario encontrado en checkAuth:", usuario);
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
    console.log("Error con checkAuth:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const setupProfile = async (req, res) => {
  try {
    console.log("=== Backend Setup Profile Debug Logs ===");
    console.log("1. Raw request body:", req.body);
    console.log("2. Raw request files:", req.files);
    console.log("3. Raw profileData from body:", req.body.profileData);
    console.log("4. Request headers:", req.headers);

    const userType = req.body.userType;
    let profileData;

    // Parse the profileData if it's a string
    if (req.body.profileData) {
      try {
        console.log("5. Attempting to parse profileData...");
        profileData = JSON.parse(req.body.profileData);
        console.log("6. Successfully parsed profileData:", profileData);
      } catch (error) {
        console.error("Error parsing profileData:", error);
        return res.status(400).json({
          success: false,
          message: "Error parsing profile data",
        });
      }
    } else {
      console.log("No profileData found in request body");
      return res.status(400).json({
        success: false,
        message: "No profile data provided",
      });
    }

    const userId = req.userId; // From auth middleware
    console.log("11. User ID:", userId);

    // Find the user first
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Update user type
    user.tipoUsuario = userType === "business" ? "Negocio" : "Cliente";
    await user.save();

    // Create corresponding profile based on user type
    if (userType === "business") {
      // Handle profile photo if exists
      let fotoPerfilUrl = profileData.datosPersonales.fotoPerfil;
      if (req.file) {
        // Convert buffer to base64
        const base64Image = req.file.buffer.toString("base64");
        fotoPerfilUrl = `data:${req.file.mimetype};base64,${base64Image}`;
      }

      const negocio = new Negocio({
        usuarioID: userId, // Reference to User's _id
        publicID: `NEG${crypto.randomBytes(8).toString("hex").toUpperCase()}`, // Public business ID
        fotoPerfil: fotoPerfilUrl,
        nombreComercial: profileData.datosPersonales.nombreComercial,
        rfc: profileData.datosPersonales.rfc,
        categoria: profileData.informacionGeneral.categoria,
        sitioWeb: profileData.informacionGeneral.sitioWeb || "",
        redesSociales: profileData.informacionGeneral.redesSociales || {
          facebook: "",
          instagram: "",
          tiktok: "",
        },
        color: "#EF4444", // Default red color
        gradient: profileData.informacionGeneral.gradient,
        establecimientos: [
          {
            establecimientoID: `EST${crypto
              .randomBytes(8)
              .toString("hex")
              .toUpperCase()}`, // Public establishment ID
            nombre: profileData.establecimiento.nombre,
            ubicacion: {
              direccion: profileData.establecimiento.ubicacion.direccion,
              ciudad: profileData.establecimiento.ubicacion.ciudad,
              estado: profileData.establecimiento.ubicacion.estado,
              codigoPostal: profileData.establecimiento.ubicacion.codigoPostal,
              zona: profileData.establecimiento.ubicacion.zona,
              coordenadas: {
                latitude: 0,
                longitude: 0,
              },
            },
            horario: [],
            metricas: {
              visitasTotales: 0,
              visitasPromedioDiarias: 0,
              horasPico: [],
              diasMasConcurridos: [],
            },
          },
        ],
        visitasTotales: 0,
      });

      console.log("Creating business profile with data:", negocio);
      await negocio.save();
      console.log("Business profile created successfully");
    } else {
      // Handle client profile setup
      let fotoPerfilUrl = profileData.datosPersonales.fotoPerfil;
      if (req.file) {
        const base64Image = req.file.buffer.toString("base64");
        fotoPerfilUrl = `data:${req.file.mimetype};base64,${base64Image}`;
      }

      const cliente = new Cliente({
        usuarioID: userId, // Reference to User's _id
        publicID: `CLI${crypto.randomBytes(8).toString("hex").toUpperCase()}`, // Public client ID
        datosPersonales: {
          nombre: profileData.datosPersonales.nombre,
          edad: parseInt(profileData.datosPersonales.edad),
          genero: profileData.datosPersonales.genero,
          fotoPerfil: fotoPerfilUrl,
          ubicacion: {
            ciudad: profileData.datosPersonales.ubicacion.ciudad,
            codigoPostal: profileData.datosPersonales.ubicacion.codigoPostal,
          },
        },
        categoriaFavorita: profileData.categoriaFavorita,
        engagement: {
          ultimoLogin: new Date(),
          sesionesTotal: 1,
          tiempoPromedioSesion: 0,
          dispositivosUsados: [],
        },
        valorCliente: {
          ltv: 0,
          churnRisk: 0,
          segmento: "nuevo",
          referidos: [],
        },
      });
      await cliente.save();
    }

    res.status(200).json({
      success: true,
      message: "Perfil configurado exitosamente",
      userType: user.tipoUsuario,
    });
  } catch (error) {
    console.error("Error in setupProfile:", error);
    res.status(500).json({
      success: false,
      message: "Error al configurar el perfil",
      error: error.message,
    });
  }
};
