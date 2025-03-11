import ResponseHandler from "../utils/responseHandler.utils.js";
import { Negocio } from "../models/negocio.model.js";

export const negocioController = {
  // Obtener el perfil del negocio
  getProfile: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return ResponseHandler.error(res, "User not authenticated", 401);
      }

      const negocio = await Negocio.findOne({ usuarioID: req.user.id });
      if (!negocio) {
        return ResponseHandler.error(res, "Negocio not found", 404);
      }
      return ResponseHandler.success(res, negocio);
    } catch (error) {
      console.error("Error in getProfile:", error);
      return ResponseHandler.error(res, error.message, 500);
    }
  },

  // Actualizar business profile
  updateProfile: async (req, res) => {
    try {
      const updatedNegocio = await Negocio.findOneAndUpdate(
        { usuarioID: req.user.id },
        { $set: req.body },
        { new: true }
      );
      return ResponseHandler.success(
        res,
        updatedNegocio,
        "Profile updated successfully"
      );
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },

  // Get business statistics
  getStatistics: async (req, res) => {
    try {
      const negocio = await Negocio.findOne({ usuarioID: req.user.id });
      // Add your statistics logic here
      const statistics = {
        totalVisits: negocio.visitasTotales,
        activePromotions: 0,
        // Add more statistics as needed
      };
      return ResponseHandler.success(res, statistics);
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },
};
