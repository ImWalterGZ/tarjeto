import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contrasena: {
      type: String,
      require: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    ultimaConeccion: {
      type: Date,
      default: Date.now,
    },
    tipoUsuario: {
      type: String,
      default: Cliente,
    },
    verificado: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
