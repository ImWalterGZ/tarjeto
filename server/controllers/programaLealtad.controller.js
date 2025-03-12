import { ProgramaLealtad } from "../models/programaLealtad.model.js";
import { Cliente } from "../models/cliente.model.js";
import { Negocio } from "../models/negocio.model.js";
import { Promocion } from "../models/promocion.model.js";

export const programaLealtadController = {
  // Create new loyalty program for a business
  crear: async (req, res) => {
    try {
      const { negocioID } = req.body;

      // Check if business already has a program
      const programaExistente = await ProgramaLealtad.findOne({ negocioID });
      if (programaExistente) {
        return res.status(400).json({
          success: false,
          message: "Este negocio ya tiene un programa de lealtad",
        });
      }

      // Calculate season dates
      const fechaInicio = new Date();
      const fechaFin = new Date();
      fechaFin.setMonth(fechaFin.getMonth() + 3);

      // Create default levels
      const nivelesDefault = [
        {
          nombre: "Bronce",
          nivel: 1,
          visitasRequeridas: 6,
          beneficios: [
            { descripcion: "Beneficios nivel Bronce", activo: true },
          ],
        },
        {
          nombre: "Plata",
          nivel: 2,
          visitasRequeridas: 8,
          beneficios: [{ descripcion: "Beneficios nivel Plata", activo: true }],
        },
        {
          nombre: "Oro",
          nivel: 3,
          visitasRequeridas: 12,
          beneficios: [{ descripcion: "Beneficios nivel Oro", activo: true }],
        },
        {
          nombre: "Rubi",
          nivel: 4,
          visitasRequeridas: 15,
          beneficios: [{ descripcion: "Beneficios nivel Rubi", activo: true }],
        },
      ];

      const nuevoPrograma = new ProgramaLealtad({
        negocioID,
        niveles: nivelesDefault,
        temporadaActual: {
          fechaInicio,
          fechaFin,
          duracionMeses: 3,
          activa: true,
        },
      });

      await nuevoPrograma.save();

      // Update business with program reference
      await Negocio.findByIdAndUpdate(negocioID, {
        programaLealtad: nuevoPrograma._id,
      });

      res.status(201).json({
        success: true,
        data: nuevoPrograma,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get program details
  obtener: async (req, res) => {
    try {
      const { negocioID } = req.params;

      // First find the business by publicID
      const negocio = await Negocio.findOne({ publicID: negocioID });
      if (!negocio) {
        return res.status(404).json({
          success: false,
          message: "Negocio no encontrado",
        });
      }

      // Then find the loyalty program using the business's internal _id
      const programa = await ProgramaLealtad.findOne({
        negocioID: negocio._id,
      }).populate("niveles.promocionesAsignadas.promocionID");

      if (!programa) {
        return res.status(404).json({
          success: false,
          message: "Programa de lealtad no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: programa,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Update program configuration
  actualizar: async (req, res) => {
    try {
      const { programaID } = req.params;
      const updates = req.body;

      const programa = await ProgramaLealtad.findByIdAndUpdate(
        programaID,
        updates,
        { new: true, runValidators: true }
      );

      if (!programa) {
        return res.status(404).json({
          success: false,
          message: "Programa de lealtad no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: programa,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Assign promotion to level
  asignarPromocion: async (req, res) => {
    try {
      const { programaID, promocionID } = req.body;

      // Find the loyalty program
      const programa = await ProgramaLealtad.findById(programaID);
      if (!programa) {
        return res.status(404).json({
          success: false,
          message: "Programa de lealtad no encontrado",
        });
      }

      // Find the promotion to get its required level
      const promocion = await Promocion.findById(promocionID);
      if (!promocion) {
        return res.status(404).json({
          success: false,
          message: "Promoción no encontrada",
        });
      }

      // Find the level based on promotion's nivelReq
      const nivel = programa.niveles.find(
        (n) => n.nivel === promocion.nivelReq
      );
      if (!nivel) {
        return res.status(404).json({
          success: false,
          message: "Nivel no encontrado para esta promoción",
        });
      }

      // Check if promotion is already assigned to this level
      const promocionExistente = nivel.promocionesAsignadas.find(
        (p) => p.promocionID.toString() === promocionID
      );

      if (promocionExistente) {
        return res.status(400).json({
          success: false,
          message: "Esta promoción ya está asignada a este nivel",
        });
      }

      // Add the promotion to the level
      nivel.promocionesAsignadas.push({
        promocionID,
        fechaAsignacion: new Date(),
        activa: true,
      });

      await programa.save();

      res.status(200).json({
        success: true,
        data: programa,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Process end of season
  procesarFinTemporada: async (req, res) => {
    try {
      const { programaID } = req.params;
      const programa = await ProgramaLealtad.findById(programaID);

      if (!programa) {
        return res.status(404).json({
          success: false,
          message: "Programa de lealtad no encontrado",
        });
      }

      // 1. Get all clients with cards for this business
      const clientes = await Cliente.find({
        "tarjetas.negocio_id": programa.negocioID,
      });

      // 2. Process level changes and count transitions
      const transiciones = {
        ascensos: {
          bronceAPlata: 0,
          plataAOro: 0,
          oroARubi: 0,
        },
        descensos: {
          plataABronce: 0,
          oroAPlata: 0,
          rubiAOro: 0,
        },
      };

      // Process each client's level change
      for (const cliente of clientes) {
        const tarjeta = cliente.tarjetas.find(
          (t) => t.negocio_id.toString() === programa.negocioID.toString()
        );

        if (tarjeta) {
          const nivelAnterior = tarjeta.nivel;
          let nuevoNivel = nivelAnterior;

          // Check for demotion based on visits
          if (programa.debeSerDegradado(nivelAnterior, tarjeta.visitas)) {
            switch (nivelAnterior) {
              case 2: // Plata to Bronce
                nuevoNivel = 1;
                transiciones.descensos.plataABronce++;
                break;
              case 3: // Oro to Plata
                nuevoNivel = 2;
                transiciones.descensos.oroAPlata++;
                break;
              case 4: // Rubi to Oro
                nuevoNivel = 3;
                transiciones.descensos.rubiAOro++;
                break;
            }
          }
          // Check for promotion based on visits
          else if (programa.puedeSerPromovido(nivelAnterior, tarjeta.visitas)) {
            switch (nivelAnterior) {
              case 1: // Bronce to Plata
                nuevoNivel = 2;
                transiciones.ascensos.bronceAPlata++;
                break;
              case 2: // Plata to Oro
                nuevoNivel = 3;
                transiciones.ascensos.plataAOro++;
                break;
              case 3: // Oro to Rubi
                nuevoNivel = 4;
                transiciones.ascensos.oroARubi++;
                break;
            }
          }

          // Update client's card if level changed
          if (nuevoNivel !== nivelAnterior) {
            tarjeta.nivel = nuevoNivel;
            tarjeta.visitas = 0; // Reset visits for new season
            await cliente.save();
          }
        }
      }

      // 3. Archive current season with final statistics
      const temporadaFinalizada = {
        ...programa.temporadaActual.toObject(),
        estadisticas: {
          ...programa.temporadaActual.estadisticas,
          clientesAscendidos: transiciones.ascensos,
          clientesDescendidos: transiciones.descensos,
        },
      };
      programa.temporadasAnteriores.push(temporadaFinalizada);

      // 4. Start new season
      const fechaInicio = new Date();
      const fechaFin = new Date();
      fechaFin.setMonth(fechaFin.getMonth() + 3);

      programa.temporadaActual = {
        fechaInicio,
        fechaFin,
        duracionMeses: 3,
        activa: true,
        estadisticas: {
          promocionesCanjeadas: 0,
          clientesAscendidos: {
            bronceAPlata: 0,
            plataAOro: 0,
            oroARubi: 0,
          },
          clientesDescendidos: {
            plataABronce: 0,
            oroAPlata: 0,
            rubiAOro: 0,
          },
          visitasTotales: 0,
        },
      };

      await programa.save();

      res.status(200).json({
        success: true,
        message: "Temporada finalizada y nueva temporada iniciada",
        data: {
          programa,
          resumenTransiciones: transiciones,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get season statistics
  obtenerEstadisticas: async (req, res) => {
    try {
      const { programaID, temporadaID } = req.params;
      const programa = await ProgramaLealtad.findById(programaID);

      if (!programa) {
        return res.status(404).json({
          success: false,
          message: "Programa de lealtad no encontrado",
        });
      }

      let estadisticas;
      if (temporadaID === "actual") {
        estadisticas = programa.temporadaActual.estadisticas;
      } else {
        const temporada = programa.temporadasAnteriores.id(temporadaID);
        if (!temporada) {
          return res.status(404).json({
            success: false,
            message: "Temporada no encontrada",
          });
        }
        estadisticas = temporada.estadisticas;
      }

      res.status(200).json({
        success: true,
        data: estadisticas,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Evaluate client level
  evaluarNivelCliente: async (req, res) => {
    try {
      const { programaID, clienteID, visitasTemporada } = req.body;

      const programa = await ProgramaLealtad.findById(programaID);
      const cliente = await Cliente.findById(clienteID);

      if (!programa || !cliente) {
        return res.status(404).json({
          success: false,
          message: "Programa o cliente no encontrado",
        });
      }

      const tarjetaActual = cliente.tarjetas.find(
        (t) => t.negocio_id.toString() === programa.negocioID.toString()
      );

      if (!tarjetaActual) {
        return res.status(404).json({
          success: false,
          message: "Cliente no tiene tarjeta para este negocio",
        });
      }

      const nivelActual = tarjetaActual.nivel;
      let nuevoNivel = nivelActual;

      // Check for promotion
      if (programa.puedeSerPromovido(nivelActual, visitasTemporada)) {
        nuevoNivel = nivelActual + 1;
      }
      // Check for demotion
      else if (programa.debeSerDegradado(nivelActual, visitasTemporada)) {
        nuevoNivel = nivelActual > 1 ? nivelActual - 1 : 1;
      }

      if (nuevoNivel !== nivelActual) {
        // Update client's card
        tarjetaActual.nivel = nuevoNivel;
        await cliente.save();

        // Update statistics
        if (nuevoNivel > nivelActual) {
          const key = `${programa.niveles[nivelActual - 1].nombre}-${
            programa.niveles[nuevoNivel - 1].nombre
          }`;
          programa.temporadaActual.estadisticas.clientesAscendidos.set(
            key,
            (programa.temporadaActual.estadisticas.clientesAscendidos.get(
              key
            ) || 0) + 1
          );
        } else {
          const key = `${programa.niveles[nivelActual - 1].nombre}-${
            programa.niveles[nuevoNivel - 1].nombre
          }`;
          programa.temporadaActual.estadisticas.clientesDescendidos.set(
            key,
            (programa.temporadaActual.estadisticas.clientesDescendidos.get(
              key
            ) || 0) + 1
          );
        }
        await programa.save();
      }

      res.status(200).json({
        success: true,
        data: {
          nivelAnterior: nivelActual,
          nivelNuevo: nuevoNivel,
          cambio: nivelActual !== nuevoNivel,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};
