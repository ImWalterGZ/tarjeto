import mongoose, { mongo } from "mongoose";

const clienteSchema = new mongoose.Schema({
  usuarioID: {
    type: String,
    require: true,
  },
  clienteID: {
    type: String,
    require: true,
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
        require: true,
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
        require: true,
      },
    },
  ],
  logros: [
    {
      logroId: {
        rype: String,
        require: true,
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
  notificaciones: {
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
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
