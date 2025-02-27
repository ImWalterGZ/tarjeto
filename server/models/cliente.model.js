import mongoose, { mongo } from "mongoose";

const clienteSchema = new mongoose.Schema({
  usuarioID: {
    type: String,
    required: true,
  },
  clienteID: {
    type: String,
    required: true,
  },
  datosPersonales: {
    edad: Number,
    genero: String,
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
