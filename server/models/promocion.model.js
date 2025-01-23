import mongoose from "mongoose";

const promocion = new mongoose.Schema({
  negocioID: {
    type: String,
    require: true,
  },
  titulo: {
    type: String,
    require: true,
  },
  descripcion: {
    type: String,
    require: true,
  },
  nivelReq: {
    type: Number,
    require: true,
  },
  status: {
    type: Boolean,
    require: true,
  },
  categoriaFavorita: {
    type: Array,
  },
  tipoPromo: {
    tipo: {
      type: String,
      require: true,
    },
    programa: {
      diaSemana: {
        type: Number,
      },
      horaInicio: {
        type: String,
      },
      horaFin: {
        type: String,
      },
      zonaHoraria: {
        type: String,
      },
    },
    periodo: {
      fechaInicio: {
        type: Date,
      },
      fechaFin: {
        type: Date,
      },
    },
    exclusivo: {
      totalInicial: {
        type: Number,
      },
      restantes: {
        type: Number,
      },
      fechaLimite: {
        type: Date,
      },
    },
  },
  limiteDeUsos: {
    porUsuario: {
      diario: {
        type: Number,
      },
      semanal: {
        type: Number,
      },
      total: {
        type: Number,
      },
    },
    totalGlobal: {
      type: Number,
    },
  },
  analitica: {
    vistas: {
      type: Number,
    },
    usos: {
      type: Number,
    },
    promedioVistaUso: {
      type: Number,
    },
    popularidadPorHora: [
      {
        hora: {
          type: Number,
        },
        usos: {
          type: Number,
        },
      },
    ],
  },
  creado: {
    type: Date,
  },
  ultimaModificacion: {
    type: Date,
  },
  creadoPor: {
    type: String,
  },
  activo: {
    type: Boolean,
  },
});
export const Promocion = mongoose.model("Promocione", promocionSchema);
