import Joi from "joi";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    next();
  };
};

// Validation schemas
export const schemas = {
  negocioUpdate: Joi.object({
    nombre: Joi.string().min(3).max(50),
    direccion: Joi.string(),
    telefono: Joi.string(),
    categoria: Joi.string(),
    // Add more fields as needed
  }),

  promotion: Joi.object({
    titulo: Joi.string().required(),
    descripcion: Joi.string().required(),
    fechaInicio: Joi.date().required(),
    fechaFin: Joi.date().required(),
    // Add more fields as needed
  }),
};
