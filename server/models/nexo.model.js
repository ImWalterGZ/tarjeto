import mongoose from "mongoose";

const nexoSchema = new mongoose.Schema({
  nexoId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  establecimientoID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Establecimiento",
    required: true,
  },
  fechaRegistro: {
    type: Date,
    required: true,
    default: Date.now,
  },
  ultimoUso: {
    type: Date,
    default: Date.now,
  },
  visitasRegistradas: {
    type: Number,
    default: 0,
  },
});

export const Nexo = mongoose.model("Nexo", nexoSchema);
