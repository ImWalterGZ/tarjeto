import { Cliente } from "../models/cliente.model.js";
import { Negocio } from "../models/negocio.model.js";

function isMobile(req) {
  const clienteHeader = req.headers["Cliente"] || req.headers["cliente"];
  return Boolean(
    clienteHeader && clienteHeader.toLowerCase().includes("flutter")
  );
}

export const mobileController = {
  getProfile: async (req, res) => {
    if (!isMobile(req)) {
      return res.status(400).json({
        success: false,
        message: "Cliente invalido",
      });
    }
    try {
      const { userId } = req.params;
      const cliente = await Cliente.findOne(
        { usuarioID: userId },
        {
          datosPersonales: 1,
          categoriaFavorita: 1,
          usuarioID: 1,
          publicID: 1,
        }
      ).lean();
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: cliente,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el perfil del cliente",
        error: error.message,
      });
    }
  },
  getTarjetas: async (req, res) => {
    if (!isMobile(req)) {
      return res.status(400).json({
        success: false,
        message: "Cliente invalido",
      });
    }
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "ID de usuario requerido",
        });
      }
      const cliente = await Cliente.findOne(
        { usuarioID: userId },
        { tarjetas: 1, _id: 0, usuarioID: 1, publicID: 1 }
      ).lean();

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
          data: cliente,
        });
      }

      if (!cliente.tarjetas || cliente.tarjetas.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Cliente no tiene tarjetas",
          data: {
            usuarioID: cliente.usuarioID,
            publicID: cliente.publicID,
            tarjetas: [],
          },
        });
      }

      const negocioIds = cliente.tarjetas.map((t) => t.negocio_id);

      const negocios = await Negocio.find(
        { publicID: { $in: negocioIds } },
        {
          publicID: 1,
          nombreComercial: 1,
          color: 1,
          gradient: 1,
          fotoPerfil: 1,
          categoria: 1,
          redesSociales: 1,
        }
      ).lean();

      return res.status(200).json({
        success: true,
        message: "Tarjetas del cliente",
        data: negocios,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener las tarjetas del cliente",
        error: error.message,
      });
    }
  },
  getOtrosNegocios: async (req, res) => {
    // aca solo hay que devolver los negocios que el usuario no tenga registrados ya
    if (!isMobile(req)) {
      return res.status(400).json({
        success: false,
        message: "Cliente invalido",
      });
    }
    try {
      const { userId } = req.params;
      const cliente = await Cliente.findOne({ usuarioID: userId });
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      const tarjetas = cliente.tarjetas;

      var negociosConocidos = [];

      tarjetas.forEach((item) => {
        negociosConocidos.push(item.negocio_id);
      });

      const results = await Negocio.find(
        {
          publicID: { $nin: negociosConocidos },
        },
        {
          fotoPerfil: 1,
          nombreComercial: 1,
          categoria: 1,
          color: 1,
          redesSociales: 1,
        }
      ).lean();

      return res.status(200).json({
        success: true,
        message: "Negocios que el usuario no tiene tarjeta",
        data: results,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Error al obtener los negocios que el usuario no tiene tarjeta",
        error: error.message,
      });
    }
  },
};
