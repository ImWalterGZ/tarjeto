import mongoose from "mongoose";

const nivelLealtadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    enum: ["Bronce", "Plata", "Oro", "Rubi"],
  },
  nivel: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4],
  },
  visitasRequeridas: {
    type: Number,
    required: true,
  },
  clientesActuales: {
    type: Number,
    default: 0,
  },
  beneficios: [
    {
      descripcion: String,
      activo: {
        type: Boolean,
        default: true,
      },
    },
  ],
  promocionesAsignadas: [
    {
      promocionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Promocion",
      },
      fechaAsignacion: {
        type: Date,
        default: Date.now,
      },
      activa: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

const temporadaSchema = new mongoose.Schema({
  fechaInicio: {
    type: Date,
    required: true,
  },
  fechaFin: {
    type: Date,
    required: true,
  },
  duracionMeses: {
    type: Number,
    default: 3,
  },
  activa: {
    type: Boolean,
    default: true,
  },
  estadisticas: {
    promocionesCanjeadas: {
      type: Number,
      default: 0,
    },
    clientesAscendidos: {
      bronceAPlata: { type: Number, default: 0 },
      plataAOro: { type: Number, default: 0 },
      oroARubi: { type: Number, default: 0 },
    },
    clientesDescendidos: {
      plataABronce: { type: Number, default: 0 },
      oroAPlata: { type: Number, default: 0 },
      rubiAOro: { type: Number, default: 0 },
    },
    visitasTotales: {
      type: Number,
      default: 0,
    },
  },
});

const programaLealtadSchema = new mongoose.Schema({
  negocioID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Negocio",
    required: true,
  },
  nombreComercialNegocio: {
    type: String,
    trim: true,
  },
  niveles: [nivelLealtadSchema],
  temporadaActual: temporadaSchema,
  temporadasAnteriores: [temporadaSchema],
  configuracion: {
    reglasDescenso: {
      plataABronce: {
        visitasMinimas: {
          type: Number,
          default: 6,
        },
      },
      oroAPlata: {
        visitasMinimas: {
          type: Number,
          default: 8,
        },
      },
      rubiAOro: {
        visitasMinimas: {
          type: Number,
          default: 15,
        },
      },
    },
    reglasAscenso: {
      bronceAPlata: {
        visitasRequeridas: {
          type: Number,
          default: 6,
        },
      },
      plataAOro: {
        visitasRequeridas: {
          type: Number,
          default: 8,
        },
      },
      oroARubi: {
        visitasRequeridas: {
          type: Number,
          default: 12,
        },
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the updatedAt field
programaLealtadSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Helper method to check if a client can be promoted
programaLealtadSchema.methods.puedeSerPromovido = function (
  nivelActual,
  visitasTemporada
) {
  const reglasAscenso = this.configuracion.reglasAscenso;

  switch (nivelActual) {
    case 1: // Bronce
      return visitasTemporada >= reglasAscenso.bronceAPlata.visitasRequeridas;
    case 2: // Plata
      return visitasTemporada >= reglasAscenso.plataAOro.visitasRequeridas;
    case 3: // Oro
      return visitasTemporada >= reglasAscenso.oroARubi.visitasRequeridas;
    default:
      return false;
  }
};

// Helper method to check if a client should be demoted
programaLealtadSchema.methods.debeSerDegradado = function (
  nivelActual,
  visitasTemporada
) {
  const reglasDescenso = this.configuracion.reglasDescenso;

  switch (nivelActual) {
    case 2: // Plata
      return visitasTemporada < reglasDescenso.plataABronce.visitasMinimas;
    case 3: // Oro
      return visitasTemporada < reglasDescenso.oroAPlata.visitasMinimas;
    case 4: // Rubi
      return visitasTemporada < reglasDescenso.rubiAOro.visitasMinimas;
    default:
      return false;
  }
};

export const ProgramaLealtad = mongoose.model(
  "ProgramaLealtad",
  programaLealtadSchema
);
