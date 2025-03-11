import { Visita } from "../models/visita.model.js";
import { Cliente } from "../models/cliente.model.js";
import { Negocio } from "../models/negocio.model.js";

// Register a new visit
export const registrarVisita = async (req, res) => {
  const { negocioID, establecimientoID, clienteID } = req.body;

  try {
    // Verify if client and business exist
    const cliente = await Cliente.findById(clienteID);
    const negocio = await Negocio.findById(negocioID);

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

    // Create visit with current hour
    const currentHour = new Date().getHours();
    const visita = new Visita({
      clienteID,
      negocioID,
      establecimientoID,
      hora: currentHour,
      trafico: 1, // Base traffic value
    });

    await visita.save();

    res.status(201).json({
      success: true,
      data: visita,
    });
  } catch (error) {
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

    const query = { negocioID };

    // Add date range filter if provided
    if (startDate && endDate) {
      query.fecha = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const visitas = await Visita.find(query)
      .populate("clienteID", "nombre email")
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

    const query = { clienteID };

    // Add date range filter if provided
    if (startDate && endDate) {
      query.fecha = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const visitas = await Visita.find(query)
      .populate("negocioID", "nombreComercial")
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
    const { startDate, endDate } = req.query;

    const matchStage = { negocioID };

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

    const traficoHorario = await Visita.aggregate([
      { $match: { negocioID } },
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
