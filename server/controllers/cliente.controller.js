import { Cliente } from "../models/cliente.model.js";

export const clienteController = {
  setupProfile: async (req, res) => {
    try {
      console.log("Received setup profile request:", {
        body: req.body,
        user: req.user,
        headers: req.headers,
      });

      const { profileData } = req.body;
      const userId = req.user.id; // From auth middleware

      console.log("Processing profile data:", {
        userId,
        profileData,
      });

      // Create a new client with the provided data
      const clienteData = {
        usuarioID: userId,
        clienteID: userId, // Using userId as clienteID for now
        datosPersonales: {
          nombre: profileData.datosPersonales.nombre,
          edad: parseInt(profileData.datosPersonales.edad),
          genero: profileData.datosPersonales.genero,
          fotoPerfil: profileData.datosPersonales.fotoPerfil, // This should already be in base64
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

      console.log("Creating client with data:", clienteData);

      const cliente = new Cliente(clienteData);
      await cliente.save();

      console.log("Client profile created successfully:", cliente);

      res.status(200).json({
        success: true,
        message: "Perfil de cliente creado exitosamente",
      });
    } catch (error) {
      console.error("Error creating client profile:", {
        error: error.message,
        stack: error.stack,
        name: error.name,
      });
      res.status(500).json({
        success: false,
        message: "Error al crear el perfil",
        error: error.message,
      });
    }
  },
};
