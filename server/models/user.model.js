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
      default: "Cliente",
    },
    categoriaFavorita: {
      type: Array,
    },
    tarjetas: [
      {
        negocio_id: {
          type: String,
          require: true,
        },
        nivel: {
          type: Number,
          default: 0,
        },
        visitas: {
          type: Number,
          default: 0,
        },
        ultimaVisita: {
          type: Date,
          require: true,
        },
      },
    ],
    verificado: {
      type: Boolean,
      default: false,
    },
    notificaciones: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
