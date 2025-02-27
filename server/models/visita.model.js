import mongoose from "mongoose";

const visitaSchema = new mongoose.Schema({
  clienteID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  negocioID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Negocio",
    required: true,
  },
  establecimientoID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Negocio.establecimientos",
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now,
  },
  hora: {
    type: Number,
    required: true,
  },
  trafico: {
    type: Number,
    required: true,
  },
});

export const Visita = mongoose.model("Visita", visitaSchema);
