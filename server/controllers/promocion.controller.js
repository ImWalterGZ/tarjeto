import { Promocion } from "../models/promocion.model.js";
import { Negocio } from "../models/negocio.model.js";

// Create a new promotion
export const createPromocion = async (req, res) => {
  try {
    // If negocioID is provided as publicID, find the internal _id
    if (req.body.negocioID) {
      const negocio = await Negocio.findOne({ publicID: req.body.negocioID });
      if (!negocio) {
        return res.status(404).json({
          success: false,
          message: "Negocio no encontrado",
        });
      }
      req.body.negocioID = negocio._id;
    }

    const promocion = new Promocion(req.body);
    await promocion.save();
    res.status(201).json({ success: true, data: promocion });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all promotions with optional filters
export const getPromociones = async (req, res) => {
  try {
    const filters = {};

    // Handle negocioID filter using publicID
    if (req.query.negocioID) {
      const negocio = await Negocio.findOne({ publicID: req.query.negocioID });
      if (!negocio) {
        return res.status(404).json({
          success: false,
          message: "Negocio no encontrado",
        });
      }
      filters.negocioID = negocio._id;
    }

    // Add other filters
    if (req.query.activo !== undefined)
      filters.activo = req.query.activo === "true";
    if (req.query.nivelReq) filters.nivelReq = parseInt(req.query.nivelReq);

    const promociones = await Promocion.find(filters).populate({
      path: "negocioID",
      select: "publicID nombreComercial",
    });

    res.status(200).json({ success: true, data: promociones });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get a single promotion by ID
export const getPromocionById = async (req, res) => {
  try {
    const promocion = await Promocion.findById(req.params.id).populate({
      path: "negocioID",
      select: "publicID nombreComercial",
    });

    if (!promocion) {
      return res
        .status(404)
        .json({ success: false, message: "Promoción no encontrada" });
    }
    res.status(200).json({ success: true, data: promocion });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update a promotion
export const updatePromocion = async (req, res) => {
  try {
    // If negocioID is being updated and provided as publicID
    if (req.body.negocioID) {
      const negocio = await Negocio.findOne({ publicID: req.body.negocioID });
      if (!negocio) {
        return res.status(404).json({
          success: false,
          message: "Negocio no encontrado",
        });
      }
      req.body.negocioID = negocio._id;
    }

    const updates = {
      ...req.body,
      ultimaModificacion: new Date(),
    };

    const promocion = await Promocion.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate({
      path: "negocioID",
      select: "publicID nombreComercial",
    });

    if (!promocion) {
      return res
        .status(404)
        .json({ success: false, message: "Promoción no encontrada" });
    }

    res.status(200).json({ success: true, data: promocion });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a promotion (soft delete)
export const deletePromocion = async (req, res) => {
  try {
    const promocion = await Promocion.findByIdAndUpdate(
      req.params.id,
      { activo: false, ultimaModificacion: new Date() },
      { new: true }
    );

    if (!promocion) {
      return res
        .status(404)
        .json({ success: false, message: "Promoción no encontrada" });
    }

    res.status(200).json({ success: true, data: promocion });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Hard delete a promotion (only for admin use)
export const hardDeletePromocion = async (req, res) => {
  try {
    const promocion = await Promocion.findByIdAndDelete(req.params.id);

    if (!promocion) {
      return res
        .status(404)
        .json({ success: false, message: "Promoción no encontrada" });
    }

    res
      .status(200)
      .json({ success: true, message: "Promoción eliminada permanentemente" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update promotion analytics
export const updatePromocionAnalytics = async (req, res) => {
  try {
    const { tipo, hora } = req.body; // tipo can be 'vista' or 'uso'
    const promocion = await Promocion.findById(req.params.id);

    if (!promocion) {
      return res
        .status(404)
        .json({ success: false, message: "Promoción no encontrada" });
    }

    // Update views or uses
    if (tipo === "vista") {
      promocion.analitica.vistas += 1;
    } else if (tipo === "uso") {
      promocion.analitica.usos += 1;

      // Update popularity by hour
      const hourIndex = promocion.analitica.popularidadPorHora.findIndex(
        (item) => item.hora === hora
      );

      if (hourIndex >= 0) {
        promocion.analitica.popularidadPorHora[hourIndex].usos += 1;
      } else {
        promocion.analitica.popularidadPorHora.push({ hora, usos: 1 });
      }
    }

    // Update average views per use
    if (promocion.analitica.usos > 0) {
      promocion.analitica.promedioVistaUso =
        promocion.analitica.vistas / promocion.analitica.usos;
    }

    await promocion.save();
    res.status(200).json({ success: true, data: promocion });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
