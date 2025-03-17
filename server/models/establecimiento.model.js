import mongoose from "mongoose";

const establecimientoSchema = new mongoose.Schema({
  establecimientoID: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  nexoID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nexo",
    required: false,
  },
  codigoConexion: {
    type: Number,
    required: false,
  },
  codigoExpiracion: {
    type: Date,
    required: false,
  },
  nombre: String,
  ubicacion: {
    direccion: String,
    ciudad: String,
    estado: String,
    codigoPostal: String,
    coordenadas: {
      latitude: Number,
      longitude: Number,
    },
    zona: String, // para agrupar por zonas comerciales
  },
  horario: [
    {
      dia: Number, // 0-6
      apertura: String,
      cierre: String,
      esHorarioEspecial: Boolean,
    },
  ],
  metricas: {
    visitasTotales: {
      type: Number,
      default: 0,
    },
    visitasPromedioDiarias: Number,
    horasPico: [
      {
        hora: Number,
        traficoPromedio: Number,
      },
    ],
    diasMasConcurridos: [
      {
        dia: Number,
        traficoPromedio: Number,
      },
    ],
  },
});

// Add index for efficient queries on connection code
establecimientoSchema.index({ codigoConexion: 1 });
// Add index for efficient expiration queries
establecimientoSchema.index({ codigoExpiracion: 1 });
establecimientoSchema.index({ establecimientoID: 1 });
export const Establecimiento = mongoose.model(
  "Establecimiento",
  establecimientoSchema
);
