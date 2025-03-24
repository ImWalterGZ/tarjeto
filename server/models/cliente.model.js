import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  // Reference to the user’s account
  usuarioID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // A unique public identifier for sharing
  publicID: {
    type: String,
    required: true,
    unique: true,
  },

  // Personal info
  datosPersonales: {
    nombre: String,
    edad: Number,
    genero: String,
    fotoPerfil: {
      type: String, // Image in base64 or path/URL
      default: null,
    },
    ubicacion: {
      ciudad: String,
      codigoPostal: String,
    },
  },

  // Client’s favorite category or categories
  categoriaFavorita: {
    type: Array,
  },

  // Searching history (example data)
  historialBusquedas: [
    {
      termino: String,
      fecha: Date,
      resultadosVistos: Number,
    },
  ],

  // Cards for each business loyalty program the customer is subscribed to
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
        default: 0, // total visits for this business
      },
      // track first/last visits and streak logic per business
      fechaPrimeraVisita: {
        type: Date,
      },
      ultimaVisita: {
        type: Date,
      },
      rachaVisitasConsecutivas: {
        type: Number,
        default: 0,
      },
      maximaRachaLograda: {
        type: Number,
        default: 0,
      },
    },
  ],

  // Achievements or badges
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

  // Engagement metrics (optional)
  engagement: {
    ultimoLogin: Date,
    sesionesTotal: Number,
    tiempoPromedioSesion: Number,
    dispositivosUsados: [
      {
        tipo: String, // e.g. “movil”, “web”
        ultimoUso: Date,
        frecuenciaUso: Number,
      },
    ],
  },

  // Lifetime value or segmentation for the customer
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
