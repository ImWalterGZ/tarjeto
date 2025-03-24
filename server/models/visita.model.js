import mongoose from "mongoose";

const visitaSchema = new mongoose.Schema({
  clienteID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  negocioID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Negocio",
    required: true,
  },
  establecimientoID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Establecimiento",
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now,
  },
  trafico: {
    type: Number,
    required: false,
  },
});

export const Visita = mongoose.model("Visita", visitaSchema);
