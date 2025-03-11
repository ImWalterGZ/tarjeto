import { Visita } from "../models/visita.model.js";
import { Cliente } from "../models/cliente.model.js";
import { Negocio } from "../models/negocio.model.js";

// Register a new visit
export const registrarVisita = async (req, res) => {
  const { negocioID, establecimientoID, clienteID } = req.body;

  try {
    // Verify if client and business exist using publicID
    const cliente = await Cliente.findOne({ publicID: clienteID });
    const negocio = await Negocio.findOne({ publicID: negocioID });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    if (!negocio) {
      return res.status(404).json({
        success: false,
        message: "Negocio no encontrado",
      });
    }

    // Verify if the establishment exists in the business
    const establecimientoExists = negocio.establecimientos.some(
      (est) => est.establecimientoID === establecimientoID
    );

    if (!establecimientoExists) {
      return res.status(404).json({
        success: false,
        message: "Establecimiento no encontrado para este negocio",
      });
    }

    // Create visit with current hour
    const currentHour = new Date().getHours();
    const visita = new Visita({
      clienteID: cliente._id,
      negocioID: negocio._id,
      establecimientoID,
      hora: currentHour,
      trafico: 1, // Base traffic value
    });

    await visita.save();

    // Update establishment metrics
    const establecimiento = negocio.establecimientos.find(
      (est) => est.establecimientoID === establecimientoID
    );
    establecimiento.metricas.visitasTotales += 1;
    await negocio.save();

    res.status(201).json({
      success: true,
      data: visita,
    });
  } catch (error) {
    console.error("Error registering visit:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get visits by business
export const getVisitasByNegocio = async (req, res) => {
  try {
    const { negocioID } = req.params;
    const { startDate, endDate } = req.query;

    // First find the business by publicID
    const negocio = await Negocio.findOne({ publicID: negocioID });
    if (!negocio) {
      return res.status(404).json({
        success: false,
        message: "Negocio no encontrado",
      });
    }

    const query = { negocioID: negocio._id };

    // Add date range filter if provided
    if (startDate && endDate) {
      query.fecha = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const visitas = await Visita.find(query)
      .populate({
        path: "clienteID",
        select: "publicID datosPersonales.nombre",
      })
      .sort({ fecha: -1 });

    res.status(200).json({
      success: true,
      data: visitas,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get visits by client
export const getVisitasByCliente = async (req, res) => {
  try {
    const { clienteID } = req.params;
    const { startDate, endDate } = req.query;

    // First find the client by publicID
    const cliente = await Cliente.findOne({ publicID: clienteID });
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    const query = { clienteID: cliente._id };

    // Add date range filter if provided
    if (startDate && endDate) {
      query.fecha = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const visitas = await Visita.find(query)
      .populate({
        path: "negocioID",
        select: "publicID nombreComercial",
      })
      .sort({ fecha: -1 });

    res.status(200).json({
      success: true,
      data: visitas,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get visit statistics
export const getVisitasStats = async (req, res) => {
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

    const { startDate, endDate } = req.query;

    const matchStage = { negocioID: negocio._id };

    // Add date range if provided
    if (startDate && endDate) {
      matchStage.fecha = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const stats = await Visita.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: "$fecha" },
            month: { $month: "$fecha" },
            day: { $dayOfMonth: "$fecha" },
            hour: "$hora",
          },
          totalVisitas: { $sum: 1 },
          traficoPromedio: { $avg: "$trafico" },
        },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
          horasPico: {
            $push: {
              hora: "$_id.hour",
              visitas: "$totalVisitas",
              traficoPromedio: "$traficoPromedio",
            },
          },
          totalVisitasDia: { $sum: "$totalVisitas" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
    ]);

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

// Get hourly traffic patterns
export const getTraficoHorario = async (req, res) => {
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

    const traficoHorario = await Visita.aggregate([
      { $match: { negocioID: negocio._id } },
      {
        $group: {
          _id: "$hora",
          totalVisitas: { $sum: 1 },
          traficoPromedio: { $avg: "$trafico" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: traficoHorario,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
