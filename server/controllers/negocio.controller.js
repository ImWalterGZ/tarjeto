import ResponseHandler from "../utils/responseHandler.utils.js";
import { Negocio } from "../models/negocio.model.js";
import crypto from "crypto";
import { Establecimiento } from "../models/establecimiento.model.js";
import { Nexo } from "../models/nexo.model.js";

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
        // weeks since registration
        semanasDesdeRegistro: Math.floor(
          (Date.now() - new Date(negocio.fechaRegistro)) /
            (7 * 24 * 60 * 60 * 1000)
        ),
        establecimientos: negocio.establecimientos.length,
        clientesUnicos: negocio.clientesUnicos,
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
      // Create new Establecimiento
      const establecimiento = new Establecimiento({
        establecimientoID: `EST${crypto
          .randomBytes(8)
          .toString("hex")
          .toUpperCase()}`,
        nombre: req.body.nombre,
        ubicacion: req.body.ubicacion,
        horario: req.body.horario || [],
        metricas: {
          visitasTotales: 0,
          visitasPromedioDiarias: 0,
          horasPico: [],
          diasMasConcurridos: [],
        },
      });

      await establecimiento.save();

      // Create Nexo document
      const nexo = new Nexo({
        establecimientoID: establecimiento._id,
        fechaRegistro: new Date(),
      });

      await nexo.save();

      // Update establecimiento with nexo reference
      establecimiento.nexoID = nexo._id;
      await establecimiento.save();

      // Add reference to Negocio
      const negocio = await Negocio.findOneAndUpdate(
        { usuarioID: req.user.id },
        {
          $push: {
            establecimientos: {
              nexoID: nexo._id,
              establecimientoID: establecimiento._id,
            },
          },
        },
        { new: true }
      ).populate({
        path: "establecimientos.establecimientoID",
        model: "Establecimiento",
      });

      if (!negocio) {
        return ResponseHandler.error(res, "Negocio not found", 404);
      }

      return ResponseHandler.success(
        res,
        establecimiento,
        "Establishment added successfully"
      );
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },

  // Get establishment
  getEstablecimiento: async (req, res) => {
    try {
      const { id } = req.params;
      const negocio = await Negocio.findOne({ usuarioID: req.user.id });

      if (!negocio) {
        return ResponseHandler.error(res, "Negocio not found", 404);
      }

      const establecimiento = await Establecimiento.find(
        {
          nombre: negocio.nombre,
        },
        { _id: 1, establecimientoID: 1 }
      );

      return ResponseHandler.success(res, establecimiento);
    } catch (error) {
      return ResponseHandler.error(res, error.message, 500);
    }
  },

  // Update establishment
  updateEstablecimiento: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Find the negocio first to get the establecimiento reference
      const negocio = await Negocio.findOne({
        usuarioID: req.user.id,
        "establecimientos.establecimientoID": id,
      });

      if (!negocio) {
        return ResponseHandler.error(res, "Establishment not found", 404);
      }

      // Update the Establecimiento document
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
        return ResponseHandler.error(res, "Establishment not found", 404);
      }

      return ResponseHandler.success(
        res,
        establecimiento,
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

      // Find the negocio first
      const negocio = await Negocio.findOne({
        usuarioID: req.user.id,
        "establecimientos.establecimientoID": id,
      });

      if (!negocio) {
        return ResponseHandler.error(
          res,
          "Negocio or establishment not found",
          404
        );
      }

      // Find and remove the Establecimiento
      const establecimiento = await Establecimiento.findById(id);
      if (!establecimiento) {
        return ResponseHandler.error(res, "Establishment not found", 404);
      }

      // Remove the Nexo document
      await Nexo.findByIdAndDelete(establecimiento.nexoID);

      // Remove the Establecimiento document
      await Establecimiento.findByIdAndDelete(id);

      // Remove the reference from Negocio
      await Negocio.findOneAndUpdate(
        { usuarioID: req.user.id },
        { $pull: { establecimientos: { establecimientoID: id } } }
      );

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
