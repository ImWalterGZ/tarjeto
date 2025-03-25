import { Cliente } from "../models/cliente.model.js";

export const clienteController = {
  setupProfile: async (req, res) => {
    try {
      console.log("Request body:", req.body);
      const { profileData } = req.body;
      console.log("Profile data:", profileData);
      console.log("User ID:", req.userId);

      const clienteData = {
        usuarioID: req.userId,
        clienteID: req.userId,
        datosPersonales: {
          nombre: profileData.datosPersonales.nombre,
          edad: parseInt(profileData.datosPersonales.edad),
          genero: profileData.datosPersonales.genero,
          fotoPerfil: profileData.datosPersonales.fotoPerfil,
          ubicacion: {
            ciudad: profileData.datosPersonales.ubicacion.ciudad,
            codigoPostal: profileData.datosPersonales.ubicacion.codigoPostal,
          },
        },
        categoriaFavorita: profileData.categoriaFavorita,
        engagement: {
          ultimoLogin: new Date(),
          sesionesTotal: 1,
          tiempoPromedioSesion: 0,
          dispositivosUsados: [],
        },
        valorCliente: {
          ltv: 0,
          churnRisk: 0,
          segmento: "nuevo",
          referidos: [],
        },
      };

      console.log("Cliente data to save:", clienteData);

      const cliente = new Cliente(clienteData);
      console.log("Cliente model instance:", cliente);

      await cliente.save();
      console.log("Cliente saved successfully");

      res.status(200).json({
        success: true,
        message: "Perfil de cliente creado exitosamente",
      });
    } catch (error) {
      console.error("Error in setupProfile:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear el perfil",
        error: error.message,
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      const cliente = await Cliente.findOne({ usuarioID: req.userId });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          datosPersonales: cliente.datosPersonales,
          categoriaFavorita: cliente.categoriaFavorita,
          engagement: cliente.engagement,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el perfil del cliente",
        error: error.message,
      });
    }
  },

  getClientData: async (req, res) => {
    try {
      const cliente = await Cliente.findOne({ usuarioID: req.userId });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      // Return complete client data
      res.status(200).json({
        success: true,
        data: cliente,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener los datos del cliente",
        error: error.message,
      });
    }
  },

  getCards: async (req, res) => {
    try {
      const cliente = await Cliente.findOne({ usuarioID: req.userId });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          tarjetas: cliente.tarjetas,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener las tarjetas del cliente",
        error: error.message,
      });
    }
  },

  getPromotions: async (req, res) => {
    try {
      const cliente = await Cliente.findOne({ usuarioID: req.userId });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          promotions: [], // TODO: Implement promotions logic
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener las promociones",
        error: error.message,
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { profileData } = req.body;
      const cliente = await Cliente.findOne({ usuarioID: req.userId });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      if (profileData.datosPersonales) {
        cliente.datosPersonales = {
          ...cliente.datosPersonales,
          ...profileData.datosPersonales,
        };
      }

      if (profileData.categoriaFavorita) {
        cliente.categoriaFavorita = profileData.categoriaFavorita;
      }

      await cliente.save();

      res.status(200).json({
        success: true,
        message: "Perfil actualizado exitosamente",
        data: cliente,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar el perfil",
        error: error.message,
      });
    }
  },

  getVisits: async (req, res) => {
    try {
      const cliente = await Cliente.findOne({ usuarioID: req.userId });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          visits: cliente.historialBusquedas,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el historial de visitas",
        error: error.message,
      });
    }
  },

  registrarVisita: async (req, res) => {
    try {
      const { termino, resultadosVistos } = req.body;
      const cliente = await Cliente.findOne({ usuarioID: req.userId });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      cliente.historialBusquedas.push({
        termino,
        fecha: new Date(),
        resultadosVistos: resultadosVistos || 0,
      });

      await cliente.save();

      res.status(200).json({
        success: true,
        message: "Visita registrada exitosamente",
        data: cliente.historialBusquedas[cliente.historialBusquedas.length - 1],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al registrar la visita",
        error: error.message,
      });
    }
  },
};
