import mongoose from "mongoose";

const mensajePantallaSchema = new mongoose.Schema(
  {
    clienteID: {
      type: String,
      required: true,
      ref: "Cliente",
    },
    establecimientoID: {
      type: String,
      required: true,
      ref: "Establecimiento",
    },
    promociones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Promocion",
      },
    ],
    datosCliente: {
      nombre: String,
      fotoPerfil: String,
      nivel: Number,
    },
    mostrado: {
      type: Boolean,
      default: false,
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
    fechaMostrado: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para mejorar el rendimiento de las consultas
mensajePantallaSchema.index({ clienteID: 1, establecimientoID: 1 });
mensajePantallaSchema.index({ mostrado: 1 });

// Método para marcar el mensaje como mostrado
mensajePantallaSchema.methods.marcarComoMostrado = async function () {
  this.mostrado = true;
  this.fechaMostrado = new Date();
  return await this.save();
};

export const MensajePantalla = mongoose.model(
  "MensajePantalla",
  mensajePantallaSchema
);
