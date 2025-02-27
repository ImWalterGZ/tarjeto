import { Visita } from "../models/visita.model.js";
import { Cliente } from "../models/cliente.model.js";
import { Negocio } from "../models/negocio.model.js";

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
