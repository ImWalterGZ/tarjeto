import mongoose from "mongoose";
import { Establecimiento } from "../models/establecimiento.model.js";
import { Negocio } from "../models/negocio.model.js";
import { Nexo } from "../models/nexo.model.js";
import ResponseHandler from "../utils/responseHandler.utils.js";

export const establecimientoController = {
  generateConnectionCode: async (req, res) => {
    try {
      console.log("=== Generate Connection Code Debug Logs ===");
      console.log("1. Request body:", req.body);
      const { establecimientoID } = req.body;
      console.log("2. Extracted establecimientoID:", establecimientoID);

      // Start a session for transaction
      const session = await mongoose.startSession();
      session.startTransaction();
      console.log("3. Transaction started");

      try {
        console.log(
          "4. Attempting to find establecimiento with ID:",
          establecimientoID
        );
        // Try to find by either _id or establecimientoID
        const establecimiento = await Establecimiento.findOne({
          $or: [
            { _id: establecimientoID },
            { establecimientoID: establecimientoID },
          ],
        }).session(session);
        console.log(
          "5. Establecimiento found:",
          establecimiento ? "Yes" : "No"
        );

        if (!establecimiento) {
          console.log("6. Establecimiento not found - Aborting transaction");
          await session.abortTransaction();
          return ResponseHandler.error(
            res,
            "Establecimiento no encontrado",
            404
          );
        }

        console.log(
          "7. Checking if establecimiento has Nexo:",
          establecimiento.nexoID ? "Yes" : "No"
        );
        // Check if establishment already has a Nexo
        if (establecimiento.nexoID) {
          console.log(
            "8. Establecimiento already has Nexo - Aborting transaction"
          );
          await session.abortTransaction();
          return ResponseHandler.error(
            res,
            "Este establecimiento ya tiene un Nexo registrado",
            400
          );
        }

        console.log("9. Checking for active connection code");
        // Check if there's an active code
        if (
          establecimiento.codigoConexion &&
          establecimiento.codigoExpiracion > new Date()
        ) {
          console.log("10. Active code found - Aborting transaction");
          await session.abortTransaction();
          return ResponseHandler.error(
            res,
            "Ya existe un código de conexión activo",
            400
          );
        }

        // Generate new 5-digit code
        const code = Math.floor(10000 + Math.random() * 90000);
        console.log("11. Generated new code:", code);

        establecimiento.codigoConexion = code;
        establecimiento.codigoExpiracion = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes
        console.log("12. Saving establecimiento with new code");
        await establecimiento.save({ session });

        console.log("13. Committing transaction");
        await session.commitTransaction();

        console.log("14. Sending successful response");
        return ResponseHandler.success(
          res,
          {
            code,
            expiresIn: "3 minutes",
          },
          "Código de conexión generado exitosamente"
        );
      } catch (error) {
        console.error("15. Error in transaction:", error);
        await session.abortTransaction();
        throw error;
      } finally {
        console.log("16. Ending session");
        session.endSession();
      }
    } catch (error) {
      console.error("17. Final error catch:", error);
      return ResponseHandler.error(res, error.message, 500);
    }
  },

  addEstablecimiento: async (req, res) => {
    try {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const establecimiento = new Establecimiento({
          establecimientoID: new mongoose.Types.ObjectId(),
          nombre: req.body.nombre,
          ubicacion: req.body.ubicacion,
          horario: req.body.horario || [],
        });
        await establecimiento.save({ session });

        // Update negocio with new establecimiento
        const negocio = await Negocio.findOneAndUpdate(
          { usuarioID: req.user.id },
          {
            $push: {
              establecimientos: { establecimientoID: establecimiento._id },
            },
          },
          { new: true, session }
        );

        if (!negocio) {
          throw new Error("Negocio no encontrado");
        }

        await session.commitTransaction();
        return ResponseHandler.success(
          res,
          establecimiento,
          "Establecimiento creado exitosamente"
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

  updateEstablecimiento: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const establecimiento = await Establecimiento.findByIdAndUpdate(
        id,
        {
          nombre: updateData.nombre,
          ubicacion: updateData.ubicacion,
          horario: updateData.horario,
        },
        { new: true }
      );

      if (!establecimiento) {
        return ResponseHandler.error(res, "Establecimiento no encontrado", 404);
      }

      return ResponseHandler.success(
        res,
        establecimiento,
        "Establecimiento actualizado exitosamente"
      );
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },

  deleteEstablecimiento: async (req, res) => {
    try {
      const { id } = req.params;
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Find and remove the Establecimiento
        const establecimiento = await Establecimiento.findByIdAndDelete(id, {
          session,
        });
        if (!establecimiento) {
          throw new Error("Establecimiento no encontrado");
        }

        // Remove reference from Negocio
        await Negocio.findOneAndUpdate(
          { usuarioID: req.user.id },
          { $pull: { establecimientos: { establecimientoID: id } } },
          { session }
        );

        await session.commitTransaction();
        return ResponseHandler.success(
          res,
          { establecimientoID: id },
          "Establecimiento eliminado exitosamente"
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

  getEstablecimiento: async (req, res) => {
    try {
      const { id } = req.params;

      // Este controlador obtiene establecimientoID por parte de un negocio.establecimientos[0]
      // busca en la coleccion de establecimientos el establecimientoID y devuelve el establecimiento

      console.log("Searching for establecimientoID:", id);
      console.log(req.params);
      const establecimiento = await Establecimiento.findOne({
        establecimientoID: id,
      });
      console.log("Query result:", establecimiento);

      if (!establecimiento) {
        return ResponseHandler.error(res, "Establecimiento no found", 404);
      }

      return ResponseHandler.success(res, establecimiento);
    } catch (error) {
      return ResponseHandler.error(res, "nioasa", 500);
    }
  },

  getNexo: async (req, res) => {
    const { id } = req.params;
    const establecimiento = await Establecimiento.findOne({
      establecimientoID: id,
    });
    console.log(establecimiento);
    console.log(req.params);
    if (!establecimiento) {
      return ResponseHandler.error(res, "Establecimiento no encontrado", 404);
    }
    if (!establecimiento.nexoID) {
      return ResponseHandler.error(res, "Nexo no encontrado", 404);
    }
    const nexo = await Nexo.findOne({
      _id: establecimiento.nexoID,
    }).lean();
    if (!nexo) {
      return ResponseHandler.error(res, "Nexo no encontrado", 404);
    }

    return ResponseHandler.success(res, nexo);
  },

  unpairNexo: async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      const establecimiento = await Establecimiento.findOne({
        establecimientoID: id,
      });
      if (!establecimiento) {
        console.log("Establecimiento no encontradoN");
        console.log(id);
        return ResponseHandler.error(
          res,
          "Establecimiento no encontradoE",
          404
        );
      }
      if (!establecimiento.nexoID) {
        return ResponseHandler.error(res, "Establecimiento no tiene Nexo", 204);
      }
      establecimiento.nexoID = null;
      await establecimiento.save();

      res
        .status(200)
        .json({ data: establecimiento, message: "Nexo desvinculado" }); // Send back the updated document.
    } catch (error) {
      // Abort the transaction on error.
      console.error("Error unpairing Nexo:", error); // Log the error for debugging.
      res
        .status(500)
        .json({ message: "Failed to unpair Nexo", error: error.message }); // Send error response.
    }
  },
};
