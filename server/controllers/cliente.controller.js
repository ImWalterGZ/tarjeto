import { Cliente } from "../models/cliente.model.js";
import { ProgramaLealtad } from "../models/programaLealtad.model.js";
import { Promocion } from "../models/promocion.model.js";
import { Negocio } from "../models/negocio.model.js";

export const clienteController = {
  setupProfile: async (req, res) => {
    try {
      console.log("Request body:", req.body);
      const { profileData } = req.body;
      console.log("Profile data:", profileData);
      console.log("User ID:", req.userId);

      const clienteData = {
        usuarioID: req.userId,
        clienteID: req.userId,
        datosPersonales: {
          nombre: profileData.datosPersonales.nombre,
          edad: parseInt(profileData.datosPersonales.edad),
          genero: profileData.datosPersonales.genero,
          fotoPerfil: profileData.datosPersonales.fotoPerfil,
          ubicacion: {
            ciudad: profileData.datosPersonales.ubicacion.ciudad,
            codigoPostal: profileData.datosPersonales.ubicacion.codigoPostal,
          },
        },
        categoriaFavorita: profileData.categoriaFavorita,
        engagement: {
          ultimoLogin: new Date(),
          sesionesTotal: 1,
          tiempoPromedioSesion: 0,
          dispositivosUsados: [],
        },
        valorCliente: {
          ltv: 0,
          churnRisk: 0,
          segmento: "nuevo",
          referidos: [],
        },
      };

      console.log("Cliente data to save:", clienteData);

      const cliente = new Cliente(clienteData);
      console.log("Cliente model instance:", cliente);

      await cliente.save();
      console.log("Cliente saved successfully");

      res.status(200).json({
        success: true,
        message: "Perfil de cliente creado exitosamente",
      });
    } catch (error) {
      console.error("Error in setupProfile:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear el perfil",
        error: error.message,
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      const cliente = await Cliente.findOne({ usuarioID: req.userId });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          datosPersonales: cliente.datosPersonales,
          categoriaFavorita: cliente.categoriaFavorita,
          tarjetas: cliente.tarjetas,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el perfil del cliente",
        error: error.message,
      });
    }
  },

  getClientData: async (req, res) => {
    try {
      const cliente = await Cliente.findOne({ usuarioID: req.userId });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      // Return complete client data
      res.status(200).json({
        success: true,
        data: cliente,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener los datos del cliente",
        error: error.message,
      });
    }
  },

  getCards: async (req, res) => {
    try {
      const cliente = await Cliente.findOne({ usuarioID: req.userId });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }
      if (cliente.tarjetas.length === 0) {
        return res.status(204).json({
          success: true,
          message: "No se encontraron tarjetas",
        });
      }

      // Get all business publicIDs from client cards
      const negocioPublicIds = cliente.tarjetas.map(
        (tarjeta) => tarjeta.negocio_id
      );

      // Find the businesses by their publicIDs
      const negocios = await Negocio.find({
        publicID: { $in: negocioPublicIds },
      });

      // Create a map of publicID to business name and internal ID
      const negocioMap = {};
      negocios.forEach((negocio) => {
        negocioMap[negocio.publicID] = {
          nombre: negocio.nombreComercial,
          internalId: negocio._id,
        };
      });

      // Find loyalty programs for these businesses using internal IDs
      const internalIds = negocios.map((negocio) => negocio._id);
      const programas = await ProgramaLealtad.find({
        negocioID: { $in: internalIds },
      });

      // Create maps for program information
      const programaInfo = {};
      programas.forEach((programa) => {
        const negocioId = programa.negocioID.toString();
        programaInfo[negocioId] = {
          reglasDescenso: programa.configuracion.reglasDescenso,
          reglasAscenso: programa.configuracion.reglasAscenso,
          temporadaFin: programa.temporadaActual?.fechaFin || null,
          niveles: programa.niveles.map((nivel) => ({
            nivel: nivel.nivel,
            nombre: nivel.nombre,
            visitasRequeridas: nivel.visitasRequeridas,
            beneficios: nivel.beneficios
              .filter((b) => b.activo)
              .map((b) => b.descripcion),
          })),
        };
      });

      // Add business name and rules to each card
      const tarjetasConInfo = cliente.tarjetas.map((tarjeta) => {
        const negocioInfo = negocioMap[tarjeta.negocio_id] || {
          nombre: "Desconocido",
        };
        const nivel = tarjeta.nivel;
        let visitasProximoNivel = 0;
        let nombreNivel = "";
        let beneficios = [];
        let proximoNivel = "";
        let temporadaFin = null;

        // Get program information if available
        if (negocioInfo.internalId) {
          const info = programaInfo[negocioInfo.internalId.toString()];
          if (info) {
            // Get temporada end date
            temporadaFin = info.temporadaFin;

            // Get visits required for next level
            const reglasAscenso = info.reglasAscenso;
            if (nivel === 1) {
              visitasProximoNivel =
                reglasAscenso.bronceAPlata?.visitasRequeridas || 0;
              proximoNivel = "Plata";
            } else if (nivel === 2) {
              visitasProximoNivel =
                reglasAscenso.plataAOro?.visitasRequeridas || 0;
              proximoNivel = "Oro";
            } else if (nivel === 3) {
              visitasProximoNivel =
                reglasAscenso.oroARubi?.visitasRequeridas || 0;
              proximoNivel = "Rubi";
            }

            // Get current level name and benefits
            const nivelInfo = info.niveles.find((n) => n.nivel === nivel);
            if (nivelInfo) {
              nombreNivel = nivelInfo.nombre;
              beneficios = nivelInfo.beneficios || [];
            }
          }
        }

        return {
          ...tarjeta.toObject(),
          negocio_nombre: negocioInfo.nombre,
          nivel_nombre: nombreNivel,
          visitas_proximo_nivel: visitasProximoNivel,
          proximo_nivel: proximoNivel,
          beneficios: beneficios,
          temporada_fin: temporadaFin,
        };
      });

      res.status(200).json({
        success: true,
        data: {
          tarjetas: tarjetasConInfo,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener las tarjetas del cliente",
        error: error.message,
      });
    }
  },

  getPromotions: async (req, res) => {
    try {
      console.log("========== INICIANDO OBTENCIÓN DE PROMOCIONES ==========");
      console.log(`Usuario ID: ${req.userId}`);

      // Find the client
      const cliente = await Cliente.findOne({ usuarioID: req.userId });
      console.log(`Cliente encontrado: ${cliente ? "Sí" : "No"}`);

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      console.log(`Tarjetas del cliente: ${JSON.stringify(cliente.tarjetas)}`);

      // If client has no cards, return empty categories
      if (!cliente.tarjetas || cliente.tarjetas.length === 0) {
        console.log("Cliente no tiene tarjetas, retornando arreglos vacíos");
        return res.status(200).json({
          success: true,
          data: {
            programa: [],
            periodo: [],
            exclusivo: [],
          },
        });
      }

      // Get all business publicIDs from client cards
      const negocioPublicIds = cliente.tarjetas.map(
        (tarjeta) => tarjeta.negocio_id
      );
      console.log(
        `IDs públicos de negocios a buscar: ${JSON.stringify(negocioPublicIds)}`
      );

      // First find the businesses by their publicIDs
      const negocios = await Negocio.find({
        publicID: { $in: negocioPublicIds },
      });
      console.log(`Negocios encontrados: ${negocios.length}`);
      negocios.forEach((n, idx) => {
        console.log(
          `Negocio ${idx + 1}: ID=${n._id}, publicID=${n.publicID}, nombre=${
            n.nombreComercial
          }`
        );
      });

      // Map publicIDs to internal ObjectIds
      const negocioIdMap = {};
      negocios.forEach((negocio) => {
        negocioIdMap[negocio.publicID] = negocio._id;
      });
      console.log(
        `Mapa de IDs públicos a IDs internos: ${JSON.stringify(negocioIdMap)}`
      );

      // Create a map of business ID to client's level for that business
      const clientLevels = {};
      cliente.tarjetas.forEach((tarjeta) => {
        // Map publicID to internal ObjectId
        const internalId = negocioIdMap[tarjeta.negocio_id];
        if (internalId) {
          clientLevels[internalId.toString()] = tarjeta.nivel;
        } else {
          console.log(
            `ADVERTENCIA: No se encontró negocio para el ID ${tarjeta.negocio_id}`
          );
        }
      });
      console.log(
        `Niveles del cliente por negocio: ${JSON.stringify(clientLevels)}`
      );

      // Get internal business IDs
      const negocioInternalIds = Object.values(negocioIdMap);
      console.log(
        `IDs internos para consultar programas: ${JSON.stringify(
          negocioInternalIds
        )}`
      );

      // Find all loyalty programs for these businesses using internal IDs
      const programas = await ProgramaLealtad.find({
        negocioID: { $in: negocioInternalIds },
      });
      console.log(`Programas de lealtad encontrados: ${programas.length}`);
      programas.forEach((programa, idx) => {
        console.log(
          `Programa ${idx + 1}: ID=${programa._id}, negocioID=${
            programa.negocioID
          }, niveles=${programa.niveles.length}`
        );
      });

      // Create a map of eligible promotion IDs
      const eligiblePromotionIds = [];

      // For each program, find promotions for client's level
      programas.forEach((programa) => {
        const negocioId = programa.negocioID.toString();
        const clientLevel = clientLevels[negocioId];
        console.log(
          `Procesando programa para negocio ${negocioId}, nivel del cliente: ${clientLevel}`
        );

        // Find all levels at or below client's level (they can access lower level promotions too)
        const eligibleLevels = programa.niveles.filter(
          (nivel) => nivel.nivel <= clientLevel
        );
        console.log(
          `Niveles elegibles: ${eligibleLevels.map((n) => n.nombre).join(", ")}`
        );

        // Get promotion IDs from these levels
        eligibleLevels.forEach((nivel) => {
          console.log(`Procesando nivel ${nivel.nombre} (${nivel.nivel})`);
          if (
            nivel.promocionesAsignadas &&
            nivel.promocionesAsignadas.length > 0
          ) {
            console.log(
              `Promociones asignadas al nivel: ${nivel.promocionesAsignadas.length}`
            );
            nivel.promocionesAsignadas.forEach((promo) => {
              if (promo.activa) {
                console.log(`Añadiendo promoción ID: ${promo.promocionID}`);
                eligiblePromotionIds.push(promo.promocionID);
              } else {
                console.log(
                  `Ignorando promoción inactiva: ${promo.promocionID}`
                );
              }
            });
          } else {
            console.log(`Nivel ${nivel.nombre} no tiene promociones asignadas`);
          }
        });
      });
      console.log(
        `Total de IDs de promociones elegibles: ${eligiblePromotionIds.length}`
      );
      console.log(
        `IDs de promociones: ${JSON.stringify(eligiblePromotionIds)}`
      );

      // Map internal IDs back to publicIDs for the response
      const negocioPublicIdMap = {};
      const negocioNameMap = {};
      negocios.forEach((negocio) => {
        negocioPublicIdMap[negocio._id.toString()] = negocio.publicID;
        negocioNameMap[negocio._id.toString()] = negocio.nombreComercial;
      });
      console.log(
        `Mapa de IDs internos a IDs públicos: ${JSON.stringify(
          negocioPublicIdMap
        )}`
      );
      console.log(
        `Mapa de IDs internos a nombres: ${JSON.stringify(negocioNameMap)}`
      );

      // Get all eligible promotions
      const promotions = await Promocion.find({
        _id: { $in: eligiblePromotionIds },
        activo: true,
      });
      console.log(`Promociones encontradas: ${promotions.length}`);
      promotions.forEach((p, idx) => {
        console.log(
          `Promoción ${idx + 1}: ID=${p._id}, título=${p.titulo}, tipo=${
            p.tipoPromo?.tipo || "sin tipo"
          }`
        );
      });

      // Categorize promotions by type
      const result = {
        programa: [],
        periodo: [],
        exclusivo: [],
      };

      // Process each promotion
      promotions.forEach((promo) => {
        const tipo = promo.tipoPromo?.tipo.toLowerCase();
        console.log(
          `Procesando promoción ID=${promo._id}, tipo=${tipo || "sin tipo"}`
        );

        if (!tipo) {
          console.log(
            `ADVERTENCIA: Promoción ${promo._id} no tiene tipo definido`
          );
          return; // Skip this promotion
        }

        const negocioId = promo.negocioID?.toString();
        if (!negocioId) {
          console.log(`ADVERTENCIA: Promoción ${promo._id} no tiene negocioID`);
        }

        const negocioPublicID =
          negocioPublicIdMap[negocioId] || promo.negocioID;
        const negocioNombre = negocioNameMap[negocioId] || "Desconocido";
        console.log(
          `NegocioID: ${negocioId}, PublicID: ${negocioPublicID}, Nombre: ${negocioNombre}`
        );

        // Base fields for all promotion types
        const basePromo = {
          id: promo._id,
          titulo: promo.titulo,
          descripcion: promo.descripcion,
          nivelReq: promo.nivelReq,
          negocioID: negocioPublicID,
          negocioNombre: negocioNombre,
        };

        // Add type-specific fields
        if (tipo === "programa") {
          console.log(`Añadiendo a categoría PROGRAMA: ${promo.titulo}`);
          result.programa.push({
            ...basePromo,
            diaSemana: promo.tipoPromo.programa?.diaSemana,
            horaInicio: promo.tipoPromo.programa?.horaInicio,
            horaFin: promo.tipoPromo.programa?.horaFin,
            zonaHoraria: promo.tipoPromo.programa?.zonaHoraria,
          });
        } else if (tipo === "periodo") {
          console.log(`Añadiendo a categoría PERIODO: ${promo.titulo}`);
          result.periodo.push({
            ...basePromo,
            fechaInicio: promo.tipoPromo.periodo?.fechaInicio,
            fechaFin: promo.tipoPromo.periodo?.fechaFin,
          });
        } else if (tipo === "exclusivo") {
          console.log(`Añadiendo a categoría EXCLUSIVO: ${promo.titulo}`);
          result.exclusivo.push({
            ...basePromo,
            totalInicial: promo.tipoPromo.exclusivo?.totalInicial,
            restantes: promo.tipoPromo.exclusivo?.restantes,
            fechaLimite: promo.tipoPromo.exclusivo?.fechaLimite,
          });
        } else {
          console.log(`ADVERTENCIA: Tipo de promoción desconocido: ${tipo}`);
        }
      });

      console.log(`Resultado final:`);
      console.log(`- Promociones tipo 'programa': ${result.programa.length}`);
      console.log(`- Promociones tipo 'periodo': ${result.periodo.length}`);
      console.log(`- Promociones tipo 'exclusivo': ${result.exclusivo.length}`);
      console.log("========== FIN DE OBTENCIÓN DE PROMOCIONES ==========");

      // Return categorized promotions
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("========== ERROR EN OBTENCIÓN DE PROMOCIONES ==========");
      console.error(`Mensaje: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
      res.status(500).json({
        success: false,
        message: "Error al obtener las promociones",
        error: error.message,
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { profileData } = req.body;
      const cliente = await Cliente.findOne({ usuarioID: req.userId });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      if (profileData.datosPersonales) {
        cliente.datosPersonales = {
          ...cliente.datosPersonales,
          ...profileData.datosPersonales,
        };
      }

      if (profileData.categoriaFavorita) {
        cliente.categoriaFavorita = profileData.categoriaFavorita;
      }

      await cliente.save();

      res.status(200).json({
        success: true,
        message: "Perfil actualizado exitosamente",
        data: cliente,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar el perfil",
        error: error.message,
      });
    }
  },

  getVisits: async (req, res) => {
    try {
      const cliente = await Cliente.findOne({ usuarioID: req.userId });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          visits: cliente.historialBusquedas,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el historial de visitas",
        error: error.message,
      });
    }
  },

  registrarVisita: async (req, res) => {
    try {
      const { termino, resultadosVistos } = req.body;
      const cliente = await Cliente.findOne({ usuarioID: req.userId });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      cliente.historialBusquedas.push({
        termino,
        fecha: new Date(),
        resultadosVistos: resultadosVistos || 0,
      });

      await cliente.save();

      res.status(200).json({
        success: true,
        message: "Visita registrada exitosamente",
        data: cliente.historialBusquedas[cliente.historialBusquedas.length - 1],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al registrar la visita",
        error: error.message,
      });
    }
  },
};
