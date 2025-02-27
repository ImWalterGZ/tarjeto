import { Negocio } from "../models/negocio.model.js";
import { User } from "../models/user.model.js";

export const crearNegocio = async (req, res) => {
  const { userID } = req.body;

  try {
    const user = await User.findOne({ userID });
    if (user) {
      console.log("Este usuario ya existe");
      return res
        .status(400)
        .json({
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

export const registrarVisita = async (req, res) => {
  const { negocioID, establecimientoID, clienteID } = req.body;

  try {
    console.log("verificando si existe cliente:", clienteID);
    const cliente = await Cliente.findOne({ clienteID });
    const negocio = await Negocio.findOne({ negocioID });

    if (!cliente) {
      console.log("No existe el cliente");
      return res
        .status(400)
        .json({ success: false, message: "No existe el cliente" });
    }
    if (!negocio) {
      console.log("No existe el negocio");
      return res
        .status(400)
        .json({ success: false, message: "No existe el negocio" });
    }

    console.log(cliente);
  } catch (error) {
    console.log("Se cometio un error");
  }
};
