import ResponseHandler from "../utils/responseHandler.utils.js";
import { Negocio } from "../models/negocio.model.js";
import crypto from "crypto";

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

  // Get branding information
  getBranding: async (req, res) => {
    try {
      const negocio = await Negocio.findOne({ usuarioID: req.user.id });
      if (!negocio) {
        return ResponseHandler.error(res, "Negocio not found", 404);
      }

      const branding = {
        color: negocio.color,
        gradient: negocio.gradient,
        fotoPerfil: negocio.fotoPerfil,
        nombreComercial: negocio.nombreComercial,
        sitioWeb: negocio.sitioWeb,
        redesSociales: negocio.redesSociales,
      };

      return ResponseHandler.success(res, branding);
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },

  // Update branding information
  updateBranding: async (req, res) => {
    try {
      const { color, gradient, sitioWeb, redesSociales } = req.body;

      const updatedNegocio = await Negocio.findOneAndUpdate(
        { usuarioID: req.user.id },
        {
          $set: {
            color,
            gradient,
            sitioWeb,
            redesSociales,
          },
        },
        { new: true }
      );

      if (!updatedNegocio) {
        return ResponseHandler.error(res, "Negocio not found", 404);
      }

      return ResponseHandler.success(
        res,
        updatedNegocio,
        "Branding updated successfully"
      );
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },

  // Add new establishment
  addEstablecimiento: async (req, res) => {
    try {
      const establecimientoData = {
        establecimientoID: `EST${crypto
          .randomBytes(8)
          .toString("hex")
          .toUpperCase()}`,
        ...req.body,
      };

      const negocio = await Negocio.findOneAndUpdate(
        { usuarioID: req.user.id },
        { $push: { establecimientos: establecimientoData } },
        { new: true }
      );

      if (!negocio) {
        return ResponseHandler.error(res, "Negocio not found", 404);
      }

      return ResponseHandler.success(
        res,
        negocio.establecimientos[negocio.establecimientos.length - 1],
        "Establishment added successfully"
      );
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },

  // Update establishment
  updateEstablecimiento: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const negocio = await Negocio.findOneAndUpdate(
        {
          usuarioID: req.user.id,
          "establecimientos.establecimientoID": id,
        },
        {
          $set: {
            "establecimientos.$": {
              establecimientoID: id,
              ...updateData,
            },
          },
        },
        { new: true }
      );

      if (!negocio) {
        return ResponseHandler.error(res, "Establishment not found", 404);
      }

      const updatedEstablecimiento = negocio.establecimientos.find(
        (est) => est.establecimientoID === id
      );

      return ResponseHandler.success(
        res,
        updatedEstablecimiento,
        "Establishment updated successfully"
      );
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },

  // Delete establishment
  deleteEstablecimiento: async (req, res) => {
    try {
      const { id } = req.params;

      const negocio = await Negocio.findOneAndUpdate(
        { usuarioID: req.user.id },
        { $pull: { establecimientos: { establecimientoID: id } } },
        { new: true }
      );

      if (!negocio) {
        return ResponseHandler.error(
          res,
          "Negocio or establishment not found",
          404
        );
      }

      return ResponseHandler.success(
        res,
        { establecimientoID: id },
        "Establishment deleted successfully"
      );
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },
};
