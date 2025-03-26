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
import { MensajePantalla } from "../models/mensajePantalla.model.js";
import Impresion from "../models/impresion.model.js";
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
          establecimientoID: establecimiento.establecimientoID,
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
          "Nexo registrado exitosamente, falta conectar el sensor"
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
  conectarSensor: async (req, res) => {
    try {
      const nexo = await Nexo.findOne({ sensorConectado: false });
      if (!nexo) {
        return ResponseHandler.error(res, "No hay nexos disponibles", 204);
      }
      nexo.sensorConectado = true;
      await nexo.save();
      return ResponseHandler.success(
        res,
        nexo,
        "Sensor conectado exitosamente"
      );
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
      if (!nexo.sensorConectado) {
        return ResponseHandler.error(res, "Sensor no conectado", 204);
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

      // Encontrar cliente y comprobar
      console.log(`🔍 Encontrando cliente con publicID: ${clienteID}`);
      const cliente = await Cliente.findOne({ publicID: clienteID });
      if (!cliente) {
        console.log(`❌ Cliente con publicID ${clienteID} no encontrado`);
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
        console.log(
          `❌ Establecimiento con ID ${establecimientoID} no encontrado`
        );
        return res.status(404).json({
          success: false,
          message: "Establecimiento no encontrado",
        });
      }
      console.log(`✅ Establecimiento encontrado: ${establecimiento._id}`);

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

      // Obtener promociones usando el método privado
      console.log(`🎁 Getting promotions for user`);
      let promociones = [];
      try {
        const promocionesResult = await nexoController._getPromocionesUsuario(
          cliente.publicID,
          establecimiento.establecimientoID
        );

        if (
          promocionesResult.success &&
          promocionesResult.data &&
          promocionesResult.data.promociones
        ) {
          // First, get complete promotion info for logging and debugging
          const promocionesCompletas = await Promise.all(
            promocionesResult.data.promociones.map(async (promo) => {
              // Check if promo is already an object with required fields or just an ID reference
              if (promo.titulo && promo.descripcion) {
                return {
                  _id: promo._id,
                  titulo: promo.titulo,
                  descripcion: promo.descripcion,
                };
              } else {
                // It's just an ID reference or incomplete object, fetch complete data
                const promoInfo = await Promocion.findOne({
                  _id: promo._id || promo, // Handle both {_id: ...} and direct ID reference
                });
                return promoInfo
                  ? {
                      _id: promoInfo._id,
                      titulo: promoInfo.titulo,
                      descripcion: promoInfo.descripcion,
                    }
                  : null;
              }
            })
          );

          // Filter out any null values
          const promocionesValidas = promocionesCompletas.filter(
            (promo) => promo !== null
          );

          // Log complete promotion objects for debugging
          console.log("Promotions data structure (complete objects):");
          console.log(JSON.stringify(promocionesValidas, null, 2));

          // Extract just the IDs for storage in the model
          promociones = promocionesValidas.map((promo) => promo._id);
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }

      console.log("Promotions data structure:");
      console.log(JSON.stringify(promociones, null, 2));
      // Crear mensaje para mostrar en pantalla
      try {
        console.log(`📝 Creating display message`);
        const mensajeData = {
          clienteID: cliente.publicID,
          establecimientoID: establecimientoID,
          nombreEstablecimiento: establecimiento.nombre,
          datosCliente: {
            nombre: cliente.datosPersonales?.nombre,
            fotoPerfil: cliente.datosPersonales?.fotoPerfil,
            tarjeta: tarjetaInfo,
          },
          nivelCliente: tarjetaInfo.nivel,
          clienteVisitas: tarjetaInfo.visitas,
          promociones: promociones, // This will now be an array of IDs
          mostrado: false,
        };

        console.log("Promotion IDs being saved:");
        console.log(mensajeData.promociones);
        const mensaje = await MensajePantalla.create(mensajeData);
        console.log(`✅ Display message created: ${mensaje._id}`);
      } catch (error) {
        console.error("❌ Error creating message:", error);
        // Log detailed error for debugging
        console.error("Error details:", error.message);
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
        nombreEstablecimiento: establecimiento.nombre,
      });
    } catch (error) {
      console.error("❌ Error in registrarVisita function:", error);
      return res.status(500).json({
        success: false,
        message: "Error al procesar la solicitud",
      });
    }
  },

  obtenerMensajePantalla: async (req, res) => {
    try {
      const { establecimientoID } = req.params;

      // Buscar el mensaje más reciente no mostrado para este establecimiento
      // Populate the promociones field to get full promotion details
      const mensaje = await MensajePantalla.findOne({
        establecimientoID,
        mostrado: false,
      })
        .populate("promociones") // Add populate here to get full promotion details
        .sort({ fechaCreacion: -1 });

      if (!mensaje) {
        return res.status(205).json({
          success: true,
          message: "No hay mensajes para mostrar",
        });
      }
      const cliente = await Cliente.findOne({ publicID: mensaje.clienteID });
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      let fotoPerfil = mensaje.datosCliente?.fotoPerfil;
      if (fotoPerfil != "null") {
        try {
          console.log(`🔄 Resizing profile image`);
          fotoPerfil = await resizeToExactDimensions(fotoPerfil);
          console.log(`✅ Image resized successfully`);
          mensaje.datosCliente.fotoPerfil = fotoPerfil;
        } catch (error) {
          console.error("❌ Error processing profile image:", error);
        }
      }

      // Extract the information we want from each promotion
      const promocionesDetalladas = mensaje.promociones.map((promo) => ({
        _id: promo._id,
        titulo: promo.titulo,
        descripcion: promo.descripcion,
      }));

      // Create a response object with the formatted promotions
      const respuesta = {
        ...mensaje.toObject(),
        promociones: promocionesDetalladas,
      };

      // Marcar el mensaje como mostrado
      mensaje.mostrado = true;
      await mensaje.save();

      return ResponseHandler.success(
        res,
        respuesta,
        "Mensaje recuperado exitosamente"
      );
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
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

  postImpresoraPromocion: async (req, res) => {
    try {
      const { promocionID, clienteID, establecimientoID } = req.body;

      // Encontrar establecimiento
      const establecimiento = await Establecimiento.findOne({
        establecimientoID: establecimientoID,
      });
      if (!establecimiento) {
        return ResponseHandler.error(res, "Establecimiento no encontrado", 404);
      }

      // Find business to get client's loyalty level
      const negocio = await Negocio.findOne({
        "establecimientos.establecimientoID": establecimiento.establecimientoID,
      });
      if (!negocio) {
        return ResponseHandler.error(res, "Negocio no encontrado", 404);
      }
      // Encontrar promoción
      const promocion = await Promocion.findOne({
        _id: promocionID,
        negocioID: negocio._id,
      });
      if (!promocion) {
        return ResponseHandler.error(res, "Promoción no encontrada", 404);
      }

      // Encontrar cliente
      const cliente = await Cliente.findOne({
        publicID: clienteID,
      });
      if (!cliente) {
        return ResponseHandler.error(res, "Cliente no encontrado", 404);
      }

      // Get client's loyalty card for this business
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

      // Crear registro de impresión
      const impresion = await Impresion.create({
        clienteID: cliente.publicID,
        nombreCliente: cliente.datosPersonales?.nombre,
        nivelCliente: tarjeta.nivel,
        establecimientoID: establecimientoID,
        nombreEstablecimiento: establecimiento.nombre,
        promocionID: promocionID,
        tituloPromocion: promocion.titulo,
        descripcionPromocion: promocion.descripcion,
        fecha: new Date(),
        mostrado: false, // Add mostrado flag
      });

      return ResponseHandler.success(
        res,
        impresion,
        "Impresión creada exitosamente"
      );
    } catch (error) {
      console.error("Error en postImpresoraPromocion:", error);
      return ResponseHandler.error(res, error.message, 500);
    }
  },

  getImpresiones: async (req, res) => {
    try {
      const { establecimientoID } = req.params;

      // Buscar la siguiente impresión no mostrada para este establecimiento
      const impresion = await Impresion.findOne({
        establecimientoID,
        mostrado: false,
      }).sort({ fecha: 1 }); // Ordenar por fecha más antigua para procesar en orden

      if (!impresion) {
        return ResponseHandler.success(
          res,
          null,
          "No hay impresiones pendientes",
          205
        );
      }

      // Marcar la impresión como mostrada
      impresion.mostrado = true;
      await impresion.save();

      return ResponseHandler.success(
        res,
        impresion,
        "Impresión recuperada exitosamente"
      );
    } catch (error) {
      console.error("Error en getImpresiones:", error);
      return ResponseHandler.error(res, error.message, 500);
    }
  },
};
