import { Negocio } from "../models/negocio.model.js";
import { User } from "../models/user.model.js";

export const crearNegocio = async (req, res) => {
  const { userID } = req.body;

  try {
    const user = await User.findOne({ userID });
    if (user) {
      console.log("Este usuario ya existe");
      return res.status(400).json({
        success: false,
        message: "Ya existe un negocio para este userID",
      });
    }
    const negocioID = "NEG-" + Date.now().toString();

    const nuevoNegocio = new Negocio({
      usuarioID: userID,
      negocioID: negocioID,
      informacionGeneral: {
        categoria: [],
        fechaRegistro: new Date(),
      },
    });

    await nuevoNegocio.save();

    return res.status(201).json({
      success: true,
      message: "Negocio creado exitosamente",
      data: {
        negocioID: negocioID,
      },
    });
  } catch (error) {
    console.error("Error al crear negocio:", error);
    return res.status(500).json({
      success: false,
      message: "Error al crear el negocio",
      error: error.message,
    });
  }
};
