import mongoose, { mongo } from "mongoose";

export const negocioSchema = new mongoose.Schema({
  usuarioID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  publicID: {
    type: String,
    required: true,
    unique: true,
    index: true,
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
  planAI: {
    type: Boolean,
    default: false,
  },
  // Datos sobre el rango de precios (ej: $, $$, $$$)
  rangoPrecios: {
    type: String,
  },

  // Cantidad total de empleados
  personalTotal: {
    type: Number,
    default: 0,
  },

  // Horario de operación para cada día de la semana
  horarioOperacion: [
    {
      dia: String, // "Lunes", "Martes", etc.
      apertura: String, // e.g. "09:00"
      cierre: String, // e.g. "18:00"
    },
  ],

  // Objetivos o metas del negocio (por ejemplo, aumentar ventas mensuales)
  metaObjetivos: {
    incrementoVentasMensuales: {
      type: Number,
      default: 0,
    },
    expansionSucursales: {
      type: Boolean,
      default: false,
    },
  },

  // Descripción breve de tu mercado meta o audiencia
  enfoqueMercado: {
    type: String,
    default: "",
  },

  // Número de platos principales (o productos destacados)
  numeroPlatosPrincipales: {
    type: Number,
    default: 0,
  },

  // Presupuesto mensual dedicado al marketing
  presupuestoMarketing: {
    type: Number,
    default: 0,
  },

  // Historia o reseña breve sobre cómo inició el negocio
  historiaNegocio: {
    type: String,
    default: "",
  },

  // Próximos eventos o promociones relevantes para el negocio
  eventosProximos: [
    {
      titulo: String,
      fecha: Date, // e.g. "2025-04-10"
    },
  ],

  // Elemento diferenciador (USP) que describe el valor único de tu negocio
  valorDiferenciador: {
    type: String,
    default: "",
  },

  // Número promedio de clientes diarios
  numeroClientesDiarios: {
    type: Number,
    default: 0,
  },

  // Calificación promedio (por ejemplo, de Google Maps o Yelp)
  calificacionPromedio: {
    type: Number,
    default: 0,
  },

  // Planes de expansión futuros
  metasDeExpansión: {
    proximaApertura: {
      type: String,
      default: "N/A",
    },
    inversionNecesaria: {
      type: Number,
      default: 0,
    },
  },

  // Métricas existentes en tu esquema original
  establecimientos: [
    {
      establecimientoID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Establecimiento",
        required: true,
      },
    },
  ],
  visitasTotales: {
    type: Number,
    default: 0,
  },
  programaLealtad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProgramaLealtad",
  },
  clientesUnicos: {
    type: Number,
    default: 0,
  },
});

export const Negocio = mongoose.model("Negocio", negocioSchema);
