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

// Get promotion statistics for a business
export const getPromocionStats = async (req, res) => {
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

    // Get all promotions for this business
    const promociones = await Promocion.find({ negocioID: negocio._id });

    // Calculate statistics
    const stats = {
      totalPromociones: promociones.length,
      promocionesActivas: promociones.filter((p) => p.activo).length,
      promocionesInactivas: promociones.filter((p) => !p.activo).length,
      estadisticasUso: {
        totalVistas: promociones.reduce(
          (sum, p) => sum + (p.analitica?.vistas || 0),
          0
        ),
        totalUsos: promociones.reduce(
          (sum, p) => sum + (p.analitica?.usos || 0),
          0
        ),
        promedioVistasPorUso: 0,
      },
      porNivel: {
        1: promociones.filter((p) => p.nivelReq === 1).length,
        2: promociones.filter((p) => p.nivelReq === 2).length,
        3: promociones.filter((p) => p.nivelReq === 3).length,
        4: promociones.filter((p) => p.nivelReq === 4).length,
      },
      popularidadPorHora: [],
    };

    // Calculate average views per use
    if (stats.estadisticasUso.totalUsos > 0) {
      stats.estadisticasUso.promedioVistasPorUso =
        stats.estadisticasUso.totalVistas / stats.estadisticasUso.totalUsos;
    }

    // Aggregate popularity by hour
    const popularidadPorHora = {};
    promociones.forEach((promocion) => {
      if (promocion.analitica?.popularidadPorHora) {
        promocion.analitica.popularidadPorHora.forEach(({ hora, usos }) => {
          popularidadPorHora[hora] = (popularidadPorHora[hora] || 0) + usos;
        });
      }
    });

    stats.popularidadPorHora = Object.entries(popularidadPorHora)
      .map(([hora, usos]) => ({ hora: parseInt(hora), usos }))
      .sort((a, b) => a.hora - b.hora);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Obtener las promociones de un negocio
export const getPromocionesNegocio = async (req, res) => {
  try {
    const { negocioID } = req.params;

    // Buscar el negocio por publicID
    const negocio = await Negocio.findOne({ publicID: negocioID });
    if (!negocio) {
      return res.status(404).json({
        success: false,
        message: "Negocio no encontrado",
      });
    }

    // Obtener todas las promociones del negocio
    const promociones = await Promocion.find({ negocioID: negocio._id });

    res.status(200).json({
      success: true,
      data: promociones,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
