import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contrasena: {
      type: String,
      require: true,
    },
    ultimaConexion: {
      type: Date,
      default: Date.now,
    },
    tipoUsuario: {
      type: String,
      required: false,
    },
    verificado: {
      type: Boolean,
      default: false,
    },
    notificaciones: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
    },
    ultimaConexion: {
      type: Date,
    },
    creadoEn: {
      type: Date,
    },
    actualizadoEn: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
