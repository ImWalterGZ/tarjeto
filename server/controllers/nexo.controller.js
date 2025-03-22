import mongoose from "mongoose";
import { Nexo } from "../models/nexo.model.js";
import { User } from "../models/user.model.js";
import { Cliente } from "../models/cliente.model.js";
import { Establecimiento } from "../models/establecimiento.model.js";
import { Negocio } from "../models/negocio.model.js";
import ResponseHandler from "../utils/responseHandler.utils.js";
import { resizeToExactDimensions } from "../utils/comprimir.js";

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
            establecimientoId: establecimiento._id,
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
      const { clienteID, establecimientoID } = req.body;

      // Validar inputs
      if (!clienteID || !establecimientoID) {
        return res.status(400).json({
          success: false,
          message: "Se requiere el ID de cliente y el de establecimiento",
        });
      }

      // Find and validate cliente
      const cliente = await Cliente.findOne({ publicID: clienteID });
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "No se encuentra cliente",
        });
      }

      //encontrar establecimiento y comprobar
      const establecimiento = await Establecimiento.findOne({
        establecimientoID: establecimientoID,
      });
      if (!establecimiento) {
        return res.status(404).json({
          success: false,
          message: "Establecimiento no encontrado",
        });
      }

      // encontrar negocio y comprobar
      const negocio = await Negocio.findOne({
        "establecimientos.establecimientoID": establecimiento.establecimientoID,
      });
      if (!negocio) {
        return res.status(404).json({
          success: false,
          message: "No se encuentra negocio",
        });
      }

      // Process profile image if it exists
      let fotoPerfil = cliente.datosPersonales?.fotoPerfil;
      let resize = false;
      if (fotoPerfil) {
        try {
          fotoPerfil = await resizeToExactDimensions(fotoPerfil);
          resize = true;
        } catch (error) {
          console.error("Error processing profile image:", error);
        }
      }

      // Find or create loyalty card
      const tarjetaIndex = cliente.tarjetas.findIndex(
        (item) => item.negocio_id === negocio.publicID
      );

      let tarjetaInfo;
      if (tarjetaIndex === -1) {
        // si no existe, creamos una nueva tarjeta
        tarjetaInfo = {
          negocio_id: negocio.publicID,
          nivel: 0,
          visitas: 1,
          ultimaVisita: new Date(),
        };
        cliente.tarjetas.push(tarjetaInfo);
      } else {
        // actualizamos datos y guardamos al cliente
        cliente.tarjetas[tarjetaIndex].ultimaVisita = new Date();
        cliente.tarjetas[tarjetaIndex].visitas += 1;
        tarjetaInfo = cliente.tarjetas[tarjetaIndex];
      }

      // Save cliente changes
      await cliente.save();

      // actualizamos datos y guardamos metricas de establecimiento
      establecimiento.metricas.visitasTotales =
        (establecimiento.metricas.visitasTotales || 0) + 1;
      await establecimiento.save();

      // actualizamos datos y guardamos estadisticas de nexo
      try {
        const nexo = await Nexo.findOne({
          establecimientoID: establecimiento._id,
        });
        if (nexo) {
          nexo.ultimoUso = new Date();
          nexo.visitasRegistradas += 1;
          await nexo.save();
        }
      } catch (error) {
        console.error("Error actualizando nexo:", error);
        // no queremos que falle la operacion si no se actualiza nexo
      }

      // devolvemos success
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
      console.error("Error registrando visita:", error);
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
};
