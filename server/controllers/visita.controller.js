import { Visita } from "../models/visita.model.js";
import { Cliente } from "../models/cliente.model.js";
import { Negocio } from "../models/negocio.model.js";
import { procesarFinTemporadaInterno } from "../services/programaLealtad.service.js";
import { ProgramaLealtad } from "../models/programaLealtad.model.js";

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

    // Check if business has a loyalty program and if season should end
    const programa = await ProgramaLealtad.findOne({ negocioID: negocio._id });
    if (programa) {
      const fechaFin = new Date(programa.temporadaActual.fechaFin);
      if (new Date() >= fechaFin) {
        // Process end of season in background
        procesarFinTemporadaInterno(programa._id)
          .then((success) => {
            if (success) {
              console.log(
                `Season processed for program ${programa._id} during visit registration`
              );
            }
          })
          .catch((error) => {
            console.error("Error processing season during visit:", error);
          });
      }

      // Update visit count in client's loyalty card
      const tarjeta = cliente.tarjetas.find(
        (t) => t.negocio_id.toString() === negocio._id.toString()
      );
      if (tarjeta) {
        tarjeta.visitas += 1;
        tarjeta.ultimaVisita = new Date();
        await cliente.save();
      }
    }

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
export const getVisitasMensualesStats = async (req, res) => {
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

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

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
