import mongoose, { mongo } from "mongoose";

const negocioSchema = new mongoose.Schema({
  usuarioID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  publicID: {
    type: String,
    required: true,
    unique: true,
  },
  fotoPerfil: {
    type: String,
    required: true,
  },
  nombreComercial: String,
  razonSocial: String,
  rfc: String,
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
  categoria: {
    type: Array,
    required: true,
  },
  sitioWeb: String,
  redesSociales: {
    facebook: String,
    instagram: String,
    tiktok: String,
  },
  color: {
    type: String,
    required: true,
  },
  gradient: {
    type: String,
    required: true,
  },

  // Array de establecimientos
  establecimientos: [
    {
      establecimientoID: {
        type: String,
        required: true,
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
    },
  ],
  visitasTotales: Number,
  // Programa de lealtad y tarjetas
  programaLealtad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProgramaLealtad",
  },

  // Logros y reconocimientos

  // Marketing y comunicación

  // Métricas de rendimiento
});
export const Negocio = mongoose.model("Negocio", negocioSchema);
