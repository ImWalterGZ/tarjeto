import mongoose, { mongo } from "mongoose";

const clienteSchema = new mongoose.Schema({
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
  datosPersonales: {
    nombre: String,
    edad: Number,
    genero: String,
    fotoPerfil: {
      type: String, // Aquí almacenaremos la imagen en base64
      default: null,
    },
    ubicacion: {
      ciudad: String,
      codigoPostal: String,
    },
  },
  categoriaFavorita: {
    type: Array,
  },
  historialBusquedas: [
    {
      termino: String,
      fecha: Date,
      resultadosVistos: Number,
    },
  ],
  tarjetas: [
    {
      negocio_id: {
        type: String,
        required: true,
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
        required: true,
      },
    },
  ],
  logros: [
    {
      logroId: {
        type: String,
        required: true,
      },
      fechaObtencion: Date,
      categoria: String,
    },
  ],
  engagement: {
    ultimoLogin: Date,
    sesionesTotal: Number,
    tiempoPromedioSesion: Number,
    dispositivosUsados: [
      {
        tipo: String,
        ultimoUso: Date,
        frecuenciaUso: Number,
      },
    ],
  },
  valorCliente: {
    ltv: Number,
    churnRisk: Number,
    segmento: String,
    referidos: [
      {
        usuarioId: String,
        fecha: Date,
        estado: String,
      },
    ],
  },
});
export const Cliente = mongoose.model("Cliente", clienteSchema);
