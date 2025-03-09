import { Cliente } from "../models/cliente.model.js";

export const clienteController = {
  setupProfile: async (req, res) => {
    try {
      const { profileData } = req.body;
      const userId = req.user.id; // Asumiendo que viene del middleware de auth

      const clienteData = {
        usuarioID: userId,
        clienteID: userId, // O genera un ID único si prefieres
        datosPersonales: {
          nombre: profileData.datosPersonales.nombre,
          edad: profileData.datosPersonales.edad,
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
        },
        valorCliente: {
          ltv: 0,
          churnRisk: 0,
          segmento: "nuevo",
        },
      };

      const cliente = new Cliente(clienteData);
      await cliente.save();

      res.status(200).json({
        success: true,
        message: "Perfil de cliente creado exitosamente",
      });
    } catch (error) {
      console.error("Error creating client profile:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear el perfil",
        error: error.message,
      });
    }
  },
};
