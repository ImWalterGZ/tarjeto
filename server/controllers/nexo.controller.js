import mongoose from "mongoose";
import { Nexo } from "../models/nexo.model.js";
import { User } from "../models/user.model.js";
import { Visita } from "../models/visita.model.js";
import { Cliente } from "../models/cliente.model.js";
import { Establecimiento } from "../models/establecimiento.model.js";
import { Negocio } from "../models/negocio.model.js";
import ResponseHandler from "../utils/responseHandler.utils.js";
import { resizeToExactDimensions } from "../utils/comprimir.js";
import { ProgramaLealtad } from "../models/programaLealtad.model.js";
import { Promocion } from "../models/promocion.model.js";
import e from "express";
import { MensajePantalla } from "../models/mensajePantalla.model.js";

export const nexoController = {
  register: async (req, res) => {
    try {
      const { connectionCode } = req.body;

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Find establishment with valid code
        const establecimiento = await Establecimiento.findOne({
          codigoConexion: connectionCode,
          codigoExpiracion: { $gt: new Date() },
        }).session(session);

        if (!establecimiento) {
          await session.abortTransaction();
          return ResponseHandler.error(res, "Código inválido o expirado", 404);
        }

        // Check if establishment already has a Nexo
        if (establecimiento.nexoID) {
          await session.abortTransaction();
          return ResponseHandler.error(
            res,
            "Este establecimiento ya tiene un Nexo registrado",
            400
          );
        }

        // Create new Nexo
        const nexo = new Nexo({
          establecimientoID: establecimiento._id,
          fechaRegistro: new Date(),
          ultimoUso: new Date(),
          visitasRegistradas: 0,
          sensorConectado: false,
        });
        await nexo.save({ session });

        // Update establishment with Nexo reference
        establecimiento.nexoID = nexo._id;
        establecimiento.codigoConexion = null;
        establecimiento.codigoExpiracion = null;
        await establecimiento.save({ session });

        await session.commitTransaction();

        return ResponseHandler.success(
          res,
          {
            nexoId: nexo._id,
            establecimientoId: establecimiento.establecimientoID,
          },
          "Nexo registrado exitosamente"
        );
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },

  getStatus: async (req, res) => {
    try {
      const { nexoId } = req.params;
      const nexo = await Nexo.findById(nexoId).populate("establecimientoID");

      if (!nexo) {
        return ResponseHandler.error(res, "Nexo no encontrado", 404);
      }

      return ResponseHandler.success(res, nexo);
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },

  getClienteData: async (req, res) => {
    try {
      const { clienteId, establecimientoID } = req.params;
      if (!clienteId || !establecimientoID) {
        return res.status(400).json({
          success: false,
          message: "Se requiere el ID de cliente y el de establecimiento",
        });
      }
      const cliente = await Cliente.findOne({
        publicID: clienteId,
      });
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }
      const establecimiento = await Establecimiento.findOne({
        establecimientoID: establecimientoID,
      });
      if (!establecimiento) {
        return res.status(404).json({
          success: false,
          message: "Establecimiento no encontradoF",
        });
      }

      const negocio = await Negocio.findOne({
        "establecimientos.establecimientoID": establecimiento.establecimientoID,
      });
      if (!negocio) {
        return res.status(404).json({
          success: false,
          message: "Negocio no encontrado",
        });
      }
      const tarjetas = cliente.tarjetas;

      const tarjeta = tarjetas.find(
        (item) => item.negocio_id === negocio.publicID
      );

      // Process profile image if it exists
      let fotoPerfil = cliente.datosPersonales?.fotoPerfil;
      let resize = false;
      if (fotoPerfil) {
        try {
          fotoPerfil = await resizeToExactDimensions(fotoPerfil);
          resize = true;
        } catch (error) {
          console.error("Error processing profile image:", error);
          // If image processing fails, we'll keep the original
        }
      }
      const nexo = await Nexo.findOne({
        establecimientoID: establecimiento._id,
      });
      if (nexo) {
        nexo.ultimoUso = new Date();
        await nexo.save();
      }
      const clienteData = {
        publicID: cliente.publicID,
        resize: resize,
        nombre: cliente.datosPersonales?.nombre,
        fotoPerfil: fotoPerfil,
      };

      return res.status(200).json({
        success: true,
        clienteData,
        tieneTarjeta: !!tarjeta,
        tarjetaInfo: tarjeta || null,
        message: tarjeta
          ? "Cliente tiene tarjeta de lealtad"
          : "Cliente NO tiene tarjeta de lealtad",
      });
    } catch (error) {
      console.error("Error fetching client data:", error);
      return res.status(500).json({
        success: false,
        message: "Error al procesar la solicitud",
      });
    }
  },

  crearTarjetaNueva: async (req, res) => {
    try {
      const { clienteID, establecimientoID } = req.body;

      if (!clienteID || !establecimientoID) {
        return res.status(400).json({
          success: false,
          message: "Se requiere el ID de cliente y el de establecimiento",
        });
      }

      // Find the client
      const cliente = await Cliente.findOne({
        publicID: clienteID,
      });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "No se encuentra cliente",
        });
      }

      // Find the establishment
      const establecimiento = await Establecimiento.findOne({
        establecimientoID: establecimientoID,
      });

      if (!establecimiento) {
        return res.status(404).json({
          success: false,
          message: "No se encuentra establecimiento",
        });
      }

      // Find the business
      const negocio = await Negocio.findOne({
        "establecimientos.establecimientoID": establecimiento.establecimientoID,
      });

      if (!negocio) {
        return res.status(404).json({
          success: false,
          message: "No se encuentra negocio",
        });
      }

      // Check if the client already has a loyalty card for this business
      const tarjetaExistente = cliente.tarjetas.find(
        (item) => item.negocio_id === negocio.publicID
      );

      if (tarjetaExistente) {
        return res.status(409).json({
          success: false,
          message:
            "El cliente ya tiene una tarjeta de lealtad con este negocio",
          tarjetaInfo: tarjetaExistente,
        });
      }

      // Create a new loyalty card
      const nuevaTarjeta = {
        negocio_id: negocio.publicID,
        nivel: 0,
        visitas: 1, // Starting with 1 since this is their first visit
        ultimaVisita: new Date(),
      };

      // Add the new card to the client's cards array
      cliente.tarjetas.push(nuevaTarjeta);

      // Save the updated client document
      await cliente.save();

      // Update establishment metrics
      establecimiento.metricas.visitasTotales =
        (establecimiento.metricas.visitasTotales || 0) + 1;
      await establecimiento.save();

      // Actualizamos visitasTotales en el negocio
      negocio.visitasTotales = (negocio.visitasTotales || 0) + 1;
      await negocio.save();

      return res.status(201).json({
        success: true,
        message: "Tarjeta de lealtad creada exitosamente",
        tarjetaInfo: nuevaTarjeta,
      });
    } catch (error) {
      console.error("Error creando tarjeta de lealtad:", error);
      return res.status(500).json({
        success: false,
        message: "Error al procesar la solicitud",
      });
    }
  },

  registrarVisita: async (req, res) => {
    try {
      console.log("📝 Starting registrarVisita function");
      const { clienteID, establecimientoID } = req.body;
      console.log(
        `🔍 Request data: clienteID=${clienteID}, establecimientoID=${establecimientoID}`
      );

      // Validar inputs
      if (!clienteID || !establecimientoID) {
        console.log(
          "❌ Missing required fields: clienteID or establecimientoID"
        );
        return res.status(400).json({
          success: false,
          message: "Se requiere el ID de cliente y el de establecimiento",
        });
      }

      // Find and validate cliente
      console.log(`🔍 Finding client with publicID: ${clienteID}`);
      const cliente = await Cliente.findOne({ publicID: clienteID });
      if (!cliente) {
        console.log(`❌ Client with publicID ${clienteID} not found`);
        return res.status(404).json({
          success: false,
          message: "No se encuentra cliente",
        });
      }
      console.log(`✅ Client found: ${cliente._id}`);

      //encontrar establecimiento y comprobar
      console.log(`🔍 Finding establishment with ID: ${establecimientoID}`);
      const establecimiento = await Establecimiento.findOne({
        establecimientoID: establecimientoID,
      });
      if (!establecimiento) {
        console.log(`❌ Establishment with ID ${establecimientoID} not found`);
        return res.status(404).json({
          success: false,
          message: "Establecimiento no encontrado",
        });
      }
      console.log(`✅ Establishment found: ${establecimiento._id}`);

      // encontrar negocio y comprobar
      console.log(
        `🔍 Finding business for establishment ID: ${establecimiento.establecimientoID}`
      );
      const negocio = await Negocio.findOne({
        "establecimientos.establecimientoID": establecimiento.establecimientoID,
      });
      if (!negocio) {
        console.log(
          `❌ Business not found for establishment ID: ${establecimiento.establecimientoID}`
        );
        return res.status(404).json({
          success: false,
          message: "No se encuentra negocio",
        });
      }
      console.log(
        `✅ Business found: ${negocio._id} (${negocio.publicID}) - Nombre: ${
          negocio.nombre || "Sin nombre"
        }`
      );

      // Process profile image if it exists
      console.log(
        `🖼️ Processing profile image, current value: ${
          cliente.datosPersonales?.fotoPerfil ? "exists" : "null"
        }`
      );
      let fotoPerfil = cliente.datosPersonales?.fotoPerfil;
      let resize = false;
      if (fotoPerfil != "null") {
        try {
          console.log(`🔄 Resizing profile image`);
          fotoPerfil = await resizeToExactDimensions(fotoPerfil);
          resize = true;
          console.log(`✅ Image resized successfully`);
        } catch (error) {
          console.error("❌ Error processing profile image:", error);
        }
      }

      // Find or create loyalty card
      console.log(
        `🔍 Looking for loyalty card for business: ${negocio.publicID}`
      );
      const tarjetaIndex = cliente.tarjetas.findIndex(
        (item) => item.negocio_id === negocio.publicID
      );
      console.log(`🃏 Loyalty card index: ${tarjetaIndex}`);

      let tarjetaInfo;
      if (tarjetaIndex === -1) {
        // si no existe, creamos una nueva tarjeta
        console.log(
          `🆕 Creating new loyalty card for client: ${cliente.publicID}`
        );
        tarjetaInfo = {
          negocio_id: negocio.publicID,
          nivel: 0,
          visitas: 1,
          ultimaVisita: new Date(),
        };
        console.log(
          `➕ Incrementing unique clients count for business: ${negocio.publicID}`
        );
        negocio.clientesUnicos = negocio.clientesUnicos + 1;
        await negocio.save();
        console.log(
          `✅ Business saved with updated unique clients: ${negocio.clientesUnicos}`
        );

        cliente.tarjetas.push(tarjetaInfo);
        console.log(`✅ New loyalty card added to client`);
      } else {
        // actualizamos datos y guardamos al cliente
        console.log(
          `🔄 Updating existing loyalty card at index: ${tarjetaIndex}`
        );
        console.log(
          `📊 Previous visits: ${cliente.tarjetas[tarjetaIndex].visitas}`
        );
        cliente.tarjetas[tarjetaIndex].ultimaVisita = new Date();
        cliente.tarjetas[tarjetaIndex].visitas += 1;
        tarjetaInfo = cliente.tarjetas[tarjetaIndex];
        console.log(`📊 Updated visits: ${tarjetaInfo.visitas}`);
      }

      // Save cliente changes
      console.log(`💾 Saving client changes`);
      await cliente.save();
      console.log(`✅ Client saved successfully`);

      // actualizamos datos y guardamos metricas de establecimiento
      console.log(`📊 Updating establishment metrics`);
      console.log(
        `📊 Previous total visits: ${
          establecimiento.metricas.visitasTotales || 0
        }`
      );
      establecimiento.metricas.visitasTotales =
        (establecimiento.metricas.visitasTotales || 0) + 1;
      await establecimiento.save();
      console.log(
        `✅ Establishment saved with updated total visits: ${establecimiento.metricas.visitasTotales}`
      );

      // Actualizamos visitasTotales en el negocio
      console.log(`📊 Updating business total visits`);
      console.log(
        `📊 Previous business total visits: ${negocio.visitasTotales || 0}`
      );
      negocio.visitasTotales = (negocio.visitasTotales || 0) + 1;
      await negocio.save();
      console.log(
        `✅ Business saved with updated total visits: ${negocio.visitasTotales}`
      );

      // actualizamos datos y guardamos estadisticas de nexo
      console.log(
        `🔍 Finding and updating Nexo for establishment: ${establecimiento._id}`
      );
      try {
        const nexo = await Nexo.findOne({
          establecimientoID: establecimiento._id,
        });
        if (nexo) {
          console.log(`✅ Nexo found: ${nexo._id}`);
          console.log(
            `📊 Previous registered visits: ${nexo.visitasRegistradas}`
          );
          nexo.ultimoUso = new Date();
          nexo.visitasRegistradas += 1;
          await nexo.save();
          console.log(
            `✅ Nexo updated with new visit count: ${nexo.visitasRegistradas}`
          );
        } else {
          console.log(
            `⚠️ No Nexo found for establishment: ${establecimiento._id}`
          );
        }
      } catch (error) {
        console.error("❌ Error updating nexo:", error);
        // no queremos que falle la operacion si no se actualiza nexo
      }

      console.log(`📝 Creating new visit record`);
      const visita = new Visita({
        clienteID: cliente._id,
        negocioID: negocio._id,
        establecimientoID: establecimientoID,
        fecha: new Date(),
      });
      await visita.save();
      console.log(`✅ Visit record saved: ${visita._id}`);

      // devolvemos success
      console.log(`🏁 Finishing registrarVisita function with success`);
      return res.status(200).json({
        success: true,
        message: "Visita registrada exitosamente",
        clienteData: {
          publicID: cliente.publicID,
          nombre: cliente.datosPersonales?.nombre,
          fotoPerfil,
          resize,
        },
        tarjetaInfo,
        visitasTotal: tarjetaInfo.visitas,
      });
    } catch (error) {
      console.error("❌ Error in registrarVisita function:", error);
      return res.status(500).json({
        success: false,
        message: "Error al procesar la solicitud",
      });
    }
  },

  getNexoStats: async (req, res) => {
    try {
      const { nexoId } = req.params;
      const nexo = await Nexo.findById(nexoId).populate("establecimientoID");

      if (!nexo) {
        return ResponseHandler.error(res, "Nexo no encontrado", 404);
      }

      const stats = {
        fechaRegistro: nexo.fechaRegistro,
        ultimoUso: nexo.ultimoUso,
        visitasRegistradas: nexo.visitasRegistradas,
        establecimiento: nexo.establecimientoID,
      };

      return ResponseHandler.success(
        res,
        stats,
        "Estadísticas del Nexo recuperadas exitosamente"
      );
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },

  getSensorConectado: async (req, res) => {
    try {
      const nexo = await Nexo.findOne({ sensorConectado: false });
      if (nexo) {
        nexo.sensorConectado = true;
        await nexo.save();
        return ResponseHandler.success(res, nexo, "Nexo sin sensor detectado");
      }
      return ResponseHandler.success(res, nexo, "No hay nexos sin sensor");
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },
  getPromocionUsuario: async (req, res) => {
    try {
      const { clienteID, establecimientoID } = req.params;

      // Encontrar cliente
      const cliente = await Cliente.findOne({ publicID: clienteID });
      if (!cliente) {
        return ResponseHandler.error(res, "Cliente no encontrado", 404);
      }

      // Encontrar establecimiento
      const establecimiento = await Establecimiento.findOne({
        establecimientoID: establecimientoID,
      });
      if (!establecimiento) {
        return ResponseHandler.error(res, "Establecimiento no encontrado", 404);
      }

      // Encontrar negocio
      const negocio = await Negocio.findOne({
        "establecimientos.establecimientoID": establecimiento.establecimientoID,
      });
      if (!negocio) {
        return ResponseHandler.error(res, "Negocio no encontrado", 404);
      }

      // Encontrar programa de lealtad
      const programaLealtad = await ProgramaLealtad.findOne({
        _id: negocio.programaLealtad,
      }).populate({
        path: "niveles.promocionesAsignadas.promocionID",
        model: "Promocion",
      });
      if (!programaLealtad) {
        return ResponseHandler.error(
          res,
          "Programa de lealtad no encontrado",
          404
        );
      }

      // Verificar nivel
      const tarjeta = cliente.tarjetas.find(
        (item) => item.negocio_id === negocio.publicID
      );
      if (!tarjeta) {
        return ResponseHandler.error(
          res,
          "El cliente no tiene tarjeta para este negocio",
          404
        );
      }
      const nivelUser = tarjeta.nivel;

      // Obtener todas las promociones para el nivel del usuario
      const promociones = [];
      programaLealtad.niveles.forEach((nivel) => {
        if (nivel.nivel <= nivelUser) {
          nivel.promocionesAsignadas.forEach((promo) => {
            if (promo.activa && promo.promocionID) {
              promociones.push(promo.promocionID);
            }
          });
        }
      });

      // Encontrar promociones activas con nivel requerido no necesarimente en programa de lealtad
      const activePromotions = await Promocion.find({
        negocioID: negocio._id,
        nivelReq: { $lte: nivelUser },
        activo: true,
      });

      // Combinar promociones de ambos fuentes
      const allPromotions = [...new Set([...promociones, ...activePromotions])];

      if (allPromotions.length === 0) {
        return ResponseHandler.error(
          res,
          "No hay promociones disponibles para tu nivel",
          404
        );
      }

      // Filtrar campos innecesarios de cada promoción
      const filteredPromotions = allPromotions.map((promo) => {
        // Extraer solo los campos necesarios
        return {
          _id: promo._id,
          negocioID: promo.negocioID,
          titulo: promo.titulo,
          descripcion: promo.descripcion,
          nivelReq: promo.nivelReq,
          status: promo.status,
        };
      });

      const promocionUsuario = {
        promociones: filteredPromotions,
        nivel: nivelUser,
      };

      return ResponseHandler.success(
        res,
        promocionUsuario,
        "Promociones encontradas"
      );
    } catch (error) {
      console.error("Error en getPromocionUsuario:", error);
      return ResponseHandler.error(res, error.message, 500);
    }
  },
  canjearPromocion: async (req, res) => {
    try {
      const { promocionID, clienteID, establecimientoID } = req.params;

      // Encontrar cliente
      const cliente = await Cliente.findOne({ publicID: clienteID });
      if (!cliente) {
        return ResponseHandler.error(res, "Cliente no encontrado", 404);
      }

      // Encontrar establecimiento
      const establecimiento = await Establecimiento.findOne({
        establecimientoID: establecimientoID,
      });
      if (!establecimiento) {
        return ResponseHandler.error(res, "Establecimiento no encontrado", 404);
      }

      // Encontrar negocio
      const negocio = await Negocio.findOne({
        "establecimientos.establecimientoID": establecimiento.establecimientoID,
      });
      if (!negocio) {
        return ResponseHandler.error(res, "Negocio no encontrado", 404);
      }

      // Encontrar promocion
      const promocion = await Promocion.findOne({
        _id: promocionID,
        negocioID: negocio._id,
      });
      if (!promocion) {
        return ResponseHandler.error(res, "Promoción no encontrada", 404);
      }

      // Encontrar programa de lealtad
      const programaLealtad = await ProgramaLealtad.findOne({
        negocioID: negocio._id,
      });
      if (!programaLealtad) {
        return ResponseHandler.error(
          res,
          "Programa de lealtad no encontrado",
          404
        );
      }

      // Incrementar contador de promociones canjeadas en la temporada actual
      if (programaLealtad.temporadaActual) {
        programaLealtad.temporadaActual.estadisticas.promocionesCanjeadas += 1;
        await programaLealtad.save();
      }

      return ResponseHandler.success(
        res,
        {
          promocionesCanjeadas:
            programaLealtad.temporadaActual.estadisticas.promocionesCanjeadas,
        },
        "Promoción canjeada exitosamente"
      );
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },
  // Método privado para obtener promociones
  _getPromocionesUsuario: async (clienteID, establecimientoID) => {
    try {
      // Encontrar cliente
      const cliente = await Cliente.findOne({ publicID: clienteID });
      if (!cliente) {
        return { success: false, message: "Cliente no encontrado" };
      }

      // Encontrar establecimiento
      const establecimiento = await Establecimiento.findOne({
        establecimientoID: establecimientoID,
      });
      if (!establecimiento) {
        return { success: false, message: "Establecimiento no encontrado" };
      }

      // Encontrar negocio
      const negocio = await Negocio.findOne({
        "establecimientos.establecimientoID": establecimiento.establecimientoID,
      });
      if (!negocio) {
        return { success: false, message: "Negocio no encontrado" };
      }

      // Encontrar programa de lealtad
      const programaLealtad = await ProgramaLealtad.findOne({
        _id: negocio.programaLealtad,
      }).populate({
        path: "niveles.promocionesAsignadas.promocionID",
        model: "Promocion",
      });
      if (!programaLealtad) {
        return { success: false, message: "Programa de lealtad no encontrado" };
      }

      // Verificar nivel
      const tarjeta = cliente.tarjetas.find(
        (item) => item.negocio_id === negocio.publicID
      );
      if (!tarjeta) {
        return {
          success: false,
          message: "El cliente no tiene tarjeta para este negocio",
        };
      }
      const nivelUser = tarjeta.nivel;

      // Obtener todas las promociones para el nivel del usuario
      const promociones = [];
      programaLealtad.niveles.forEach((nivel) => {
        if (nivel.nivel <= nivelUser) {
          nivel.promocionesAsignadas.forEach((promo) => {
            if (promo.activa && promo.promocionID) {
              promociones.push(promo.promocionID);
            }
          });
        }
      });

      // Encontrar promociones activas con nivel requerido
      const activePromotions = await Promocion.find({
        negocioID: negocio._id,
        nivelReq: { $lte: nivelUser },
        activo: true,
      });

      // Combinar promociones de ambos fuentes
      const allPromotions = [...new Set([...promociones, ...activePromotions])];

      if (allPromotions.length === 0) {
        return {
          success: false,
          message: "No hay promociones disponibles para tu nivel",
        };
      }

      return {
        success: true,
        data: {
          promociones: allPromotions,
          nivel: nivelUser,
        },
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  mostrarEnPantalla: async (req, res) => {
    try {
      const { clienteID, establecimientoID } = req.body;

      // Encontrar cliente
      const cliente = await Cliente.findOne({ publicID: clienteID });
      if (!cliente) {
        return ResponseHandler.error(res, "Cliente no encontrado", 404);
      }

      // Encontrar establecimiento
      const establecimiento = await Establecimiento.findOne({
        establecimientoID: establecimientoID,
      });
      if (!establecimiento) {
        return ResponseHandler.error(res, "Establecimiento no encontrado", 404);
      }

      // Obtener promociones del usuario usando el método privado
      const promocionesResult = await nexoController._getPromocionesUsuario(
        clienteID,
        establecimientoID
      );
      if (!promocionesResult.success) {
        return ResponseHandler.error(res, promocionesResult.message, 404);
      }

      // Crear nuevo mensaje para pantalla
      const mensajePantalla = new MensajePantalla({
        clienteID: cliente.publicID,
        establecimientoID: establecimiento.establecimientoID,
        promociones: promocionesResult.data.promociones.map((p) => p._id),
        datosCliente: {
          nombre: cliente.datosPersonales?.nombre,
          fotoPerfil: cliente.datosPersonales?.fotoPerfil,
          nivel: promocionesResult.data.nivel,
        },
      });

      await mensajePantalla.save();

      return ResponseHandler.success(
        res,
        mensajePantalla,
        "Mensaje creado para pantalla"
      );
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },

  obtenerMensajePantalla: async (req, res) => {
    try {
      const { establecimientoID } = req.params;

      // Buscar el mensaje más reciente no mostrado para este establecimiento
      const mensaje = await MensajePantalla.findOne({
        establecimientoID,
        mostrado: false,
      }).sort({ fechaCreacion: -1 });

      if (!mensaje) {
        return res.status(205).json({
          success: true,
          message: "No hay mensajes para mostrar",
        });
      }

      // Marcar el mensaje como mostrado
      mensaje.mostrado = true;
      await mensaje.save();

      return ResponseHandler.success(
        res,
        mensaje,
        "Mensaje recuperado exitosamente"
      );
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },
};
