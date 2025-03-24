import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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
import { ProgramaLealtad } from "../models/programaLealtad.model.js";
import { Establecimiento } from "../models/establecimiento.model.js";
import mongoose from "mongoose";

function isMobile(req) {
  const clienteHeader = req.headers["Cliente"] || req.headers["cliente"];
  return Boolean(
    clienteHeader && clienteHeader.toLowerCase().includes("flutter")
  );
}

export const login = async (req, res) => {
  const { email, contrasena } = req.body;
  const isMobileClient = isMobile(req);

  try {
    console.log("Intento de login para:", email);
    const usuario = await User.findOne({ email });

    if (!usuario) {
      console.log("Usuario no encontrado:", email);
      return res
        .status(400)
        .json({ success: false, message: "Credenciales inválidas" });
    }

    if (!usuario.verificado) {
      console.log("Usuario no verificado:", email);
      return res.status(400).json({
        success: false,
        message: "Por favor verifica tu cuenta antes de iniciar sesión",
      });
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

    const token = generateTokenAndSetCookie(res, usuario._id, isMobileClient);
    // console.log("Token generado para usuario:", email);

    usuario.ultimaConexion = new Date();
    await usuario.save();

    let perfil = null;
    if (usuario.tipoUsuario === "Cliente") {
      perfil = await Cliente.findOne({ usuarioID: usuario._id });
      console.log("Cliente encontrado:", perfil);
    } else if (usuario.tipoUsuario === "Negocio") {
      perfil = await Negocio.findOne({ usuarioID: usuario._id });
      console.log("Negocio encontrado:", perfil);
    }

    console.log("Login exitoso para usuario:", email);
    res.status(200).json({
      success: true,
      message: "Login exitoso",
      user: {
        ...usuario._doc,
        contrasena: undefined,
        perfil: perfil,
      },
      token: isMobileClient ? token : undefined,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const signup = async (req, res) => {
  console.log("=== Starting signup function ===");
  console.log("Request body:", { ...req.body, contrasena: "[REDACTED]" });

  const { email, contrasena, nombre } = req.body;
  let userResponse = null;

  try {
    if (!email || !contrasena) {
      throw new Error("Todos los campos son requeridos");
    }

    console.log("1. Checking if user exists");
    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return res
        .status(400)
        .json({ success: false, message: "El usuario ya existe" });
    }

    console.log("2. Hashing password");
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const verificationToken = codigoVerificacion();

    console.log("3. Creating new user");
    const user = new User({
      email,
      contrasena: hashedPassword,
      nombre: nombre || " ",
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    console.log("4. Saving user to database");
    await user.save();
    console.log("5. User saved successfully");

    console.log("6. Generating JWT token");
    const token = generateTokenAndSetCookie(res, user._id, isMobile(req));
    console.log("7. Token generated successfully");

    // Prepare the user response object
    userResponse = {
      success: true,
      message: "Usuario creado con exito",
      user: {
        ...user._doc,
        contrasena: undefined,
      },
    };

    // Try to send verification email but don't let it break the flow
    try {
      console.log("8. Attempting to send verification email");
      await sendVerificationEmail(user.email, verificationToken);
      console.log("9. Verification email sent successfully");
    } catch (emailError) {
      console.warn("Warning: Failed to send verification email:", {
        error: emailError.message,
        userEmail: email,
      });
      // Add a warning to the response but keep it successful
      userResponse.emailWarning =
        "Cuenta creada exitosamente, pero hubo un problema al enviar el email de verificación. Por favor, contacte a soporte.";
    }

    console.log("10. Sending success response");
    res.status(201).json(userResponse);
    console.log("=== Signup function completed successfully ===");
  } catch (error) {
    console.error("=== Error in signup ===");
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
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
  console.log("=== Starting verifyEmail function ===");
  console.log("Request body:", req.body);

  const { code } = req.body;
  try {
    console.log("1. Attempting to verify code:", code);

    // Log the query conditions
    console.log("2. Query conditions:", {
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
      currentTime: new Date(),
    });

    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    console.log(
      "3. User lookup result:",
      user ? "User found" : "User not found"
    );
    if (user) {
      console.log("4. User details:", {
        id: user._id,
        email: user.email,
        verificationToken: user.verificationToken,
        tokenExpiry: user.verificationTokenExpiresAt,
      });
    }

    if (!user) {
      console.log("5. Verification failed - Invalid or expired code");
      return res
        .status(400)
        .json({ success: false, message: "Codigo invalido o codigo expirado" });
    }

    console.log("6. Updating user verification status");
    user.verificado = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    console.log("7. Saving user changes");
    await user.save();
    console.log("8. User changes saved successfully");

    console.log("9. Generating JWT token");
    const token = generateTokenAndSetCookie(res, user._id);
    console.log("10. Token generated successfully");

    // Try to send welcome email but don't wait for it or let it break the flow
    try {
      console.log("11. Attempting to send welcome email");
      await sendWelcomeEmail(user.email, user.nombre);
      console.log("12. Welcome email sent successfully");
    } catch (emailError) {
      // Just log the email error but continue with the success response
      console.warn(
        "Warning: Failed to send welcome email:",
        emailError.message
      );
    }

    console.log("13. Sending success response");
    res.status(200).json({
      success: true,
      message: `Email verificado correctamente, ${user.nombre}`,
      token,
      user: {
        ...user._doc,
        contrasena: undefined,
      },
    });
    console.log("=== verifyEmail function completed successfully ===");
  } catch (error) {
    console.error("=== Error in verifyEmail ===");
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    console.error("Request body at time of error:", req.body);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
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
    // console.log("ID de usuario en checkAuth:", req.userId);
    const usuario = await User.findOne({ _id: req.userId });
    // console.log("Usuario encontrado en checkAuth:", usuario);

    if (!usuario) {
      return res
        .status(400)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Get profile data based on user type
    let profileData = null;
    if (usuario.tipoUsuario === "Cliente") {
      profileData = await Cliente.findOne({ usuarioID: usuario._id });
      //  console.log("Perfil de cliente encontrado:", profileData);
    } else if (usuario.tipoUsuario === "Negocio") {
      profileData = await Negocio.findOne({ usuarioID: usuario._id });
      // console.log("Perfil de negocio encontrado:", profileData);
    }

    res.status(200).json({
      success: true,
      usuario: {
        ...usuario._doc,
        contrasena: undefined,
      },
      profile: profileData,
      userType: usuario.tipoUsuario,
    });
  } catch (error) {
    // console.log("Error con checkAuth:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const setupProfile = async (req, res) => {
  try {
    console.log("=== Backend Setup Profile Debug Logs ===");
    console.log("1. Raw request body:", req.body);
    //    console.log("2. Raw request files:", req.files);
    //console.log("3. Raw profileData from body:", req.body.profileData);
    console.log("4. Request headers:", req.headers);

    const userType = req.body.userType;
    console.log("5. User type from request:", userType);

    let profileData;

    // Parse the profileData if it's a string
    if (req.body.profileData) {
      try {
        // console.log("6. Attempting to parse profileData...");
        profileData = JSON.parse(req.body.profileData);
        // console.log("7. Successfully parsed profileData:", profileData);
      } catch (error) {
        // console.error("8. Error parsing profileData:", error);
        return res.status(400).json({
          success: false,
          message: "Error parsing profile data",
          error: error.message,
        });
      }
    } else {
      // console.log("8. No profileData found in request body");
      return res.status(400).json({
        success: false,
        message: "No profile data provided",
      });
    }

    const userId = req.userId; // From auth middleware
    // console.log("9. User ID from auth middleware:", userId);

    // Find the user first
    const user = await User.findById(userId);
    console.log(req.body.profileData);
    if (!user) {
      // console.log("10. User not found with ID:", userId);
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }
    // console.log("10. Found user:", user);

    // Update user type first and ensure it's saved
    const newUserType = userType === "business" ? "Negocio" : "Cliente";
    // console.log("11. Setting user type to:", newUserType);

    // Check if a profile already exists
    const existingClientProfile = await Cliente.findOne({ usuarioID: userId });
    const existingBusinessProfile = await Negocio.findOne({
      usuarioID: userId,
    });

    if (existingClientProfile || existingBusinessProfile) {
      // console.log("12. Profile already exists for user");
      return res.status(400).json({
        success: false,
        message: "Ya existe un perfil para este usuario",
      });
    }

    // Update and save user type
    user.tipoUsuario = newUserType;
    await user.save();
    // console.log("13. User type updated successfully");

    // Create corresponding profile based on user type
    if (userType === "business") {
      // console.log("14. Creating business profile");
      try {
        // Handle profile photo if exists
        let fotoPerfilUrl = profileData.datosPersonales.fotoPerfil;
        if (req.file) {
          // console.log("15. Processing profile photo from request file");
          const base64Image = req.file.buffer.toString("base64");
          fotoPerfilUrl = `data:${req.file.mimetype};base64,${base64Image}`;
        }

        // First create the Establecimiento
        const establecimiento = new Establecimiento({
          establecimientoID: new mongoose.Types.ObjectId(),
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
        });

        // console.log("15a. Saving establecimiento");
        await establecimiento.save();

        const negocio = new Negocio({
          usuarioID: userId,
          publicID: `NEG${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
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
          color: "#EF4444",
          gradient: profileData.informacionGeneral.gradient,
          establecimientos: [
            {
              establecimientoID: establecimiento.establecimientoID,
            },
          ],
          visitasTotales: 0,
          horarioOperacion:
            profileData.informacionGeneral.horarioOperacion || [],
          rangoPrecios: profileData.informacionGeneral.rangoPrecios || "",
          personalTotal: profileData.informacionGeneral.personalTotal || 0,
        });

        // console.log("16. Attempting to save business profile");
        await negocio.save();
        // console.log("17. Business profile saved successfully");
        // Create loyalty program
        // console.log("18. Creating loyalty program");
        try {
          const fechaInicio = new Date();
          const fechaFin = new Date();
          fechaFin.setMonth(
            fechaFin.getMonth() +
              profileData.programaLealtad.temporadaActual.duracionMeses
          );

          const programaLealtad = new ProgramaLealtad({
            negocioID: negocio._id,
            niveles: profileData.programaLealtad.niveles,
            temporadaActual: {
              fechaInicio,
              fechaFin,
              duracionMeses:
                profileData.programaLealtad.temporadaActual.duracionMeses,
              activa: profileData.programaLealtad.temporadaActual.activa,
              estadisticas: {
                promocionesCanjeadas: 0,
                clientesAscendidos: {
                  bronceAPlata: 0,
                  plataAOro: 0,
                  oroARubi: 0,
                },
                clientesDescendidos: {
                  plataABronce: 0,
                  oroAPlata: 0,
                  rubiAOro: 0,
                },
                visitasTotales: 0,
              },
            },
            temporadasAnteriores: [],
            configuracion: {
              reglasDescenso: {
                plataABronce: { visitasMinimas: 6 },
                oroAPlata: { visitasMinimas: 8 },
                rubiAOro: { visitasMinimas: 15 },
              },
              reglasAscenso: {
                bronceAPlata: { visitasRequeridas: 6 },
                plataAOro: { visitasRequeridas: 8 },
                oroARubi: { visitasRequeridas: 12 },
              },
            },
          });

          // console.log("19. Attempting to save loyalty program");
          await programaLealtad.save();
          // console.log("20. Loyalty program saved successfully");

          // Update business with loyalty program reference
          // console.log("21. Updating business with loyalty program reference");
          negocio.programaLealtad = programaLealtad._id;
          await negocio.save();
          // console.log("22. Business updated with loyalty program reference");
        } catch (error) {
          // console.error("Error creating loyalty program:", error);
          // Roll back business profile creation
          await Negocio.findByIdAndDelete(negocio._id);
          throw new Error("Error creating loyalty program: " + error.message);
        }
      } catch (error) {
        // console.error("Error in business profile creation:", error);
        // Roll back user type update
        user.tipoUsuario = null;
        await user.save();
        throw error;
      }
    } else {
      // Handle client profile setup
      let fotoPerfilUrl = profileData.datosPersonales.fotoPerfil;
      if (req.file) {
        const base64Image = req.file.buffer.toString("base64");
        fotoPerfilUrl = `data:${req.file.mimetype};base64,${base64Image}`;
      }

      const cliente = new Cliente({
        usuarioID: userId,
        publicID: `CLI${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
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
    // console.error("Error in setupProfile - Full error:", error);
    // console.error("Error stack trace:", error.stack);
    // console.error("Request body at time of error:", req.body);
    // console.error("User ID at time of error:", req.userId);
    res.status(500).json({
      success: false,
      message: "Error al configurar el perfil",
      error: error.message,
      details: error.stack,
    });
  }
};
