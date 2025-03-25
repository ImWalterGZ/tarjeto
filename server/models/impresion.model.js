import mongoose from "mongoose";

const impresionSchema = new mongoose.Schema({
  clienteID: {
    type: String,
    required: true,
  },
  nombreCliente: {
    type: String,
    required: true,
  },
  nivelCliente: {
    type: Number,
    required: true,
  },
  establecimientoID: {
    type: String,
    required: true,
  },
  nombreEstablecimiento: {
    type: String,
    required: true,
  },
  promocionID: {
    type: String,
    required: true,
  },
  tituloPromocion: {
    type: String,
    required: true,
  },
  descripcionPromocion: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  mostrado: {
    type: Boolean,
    default: false,
  },
});

const Impresion = mongoose.model("Impresion", impresionSchema);

export default Impresion;
