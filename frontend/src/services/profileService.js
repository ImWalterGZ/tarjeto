import apiClient from "../config/axios";
import { toast } from "react-hot-toast";

export const profileService = {
  /**
   * Submits a user profile setup
   * @param {string} userType - Type of user (business or user)
   * @param {object} answers - Answers/data collected from the profile setup
   * @returns {Promise} - API response
   */
  setupProfile: async (userType, answers) => {
    try {
      const formData = new FormData();

      // Set userType
      formData.append("userType", userType);

      if (userType === "user") {
        // Structure the data for clients
        const profileData = {
          datosPersonales: {
            nombre: answers.nombre,
            edad: parseInt(answers.edad),
            genero: answers.genero,
            fotoPerfil: answers.fotoPerfil,
            ubicacion: {
              ciudad: answers.ciudad,
              codigoPostal: answers.codigoPostal,
            },
          },
          categoriaFavorita: answers.categoriasFavoritas,
        };

        formData.append("profileData", JSON.stringify(profileData));
      } else {
        // Structure business data
        const profileData = {
          datosPersonales: {
            nombreComercial: answers.nombreComercial,
            rfc: answers.rfc,
            fotoPerfil: answers.fotoPerfil,
          },
          informacionGeneral: {
            nombreComercial: answers.nombreComercial,
            categoria: answers.categoria ? [answers.categoria] : [],
            gradient: answers.gradient,
            sitioWeb: answers.sitioWeb || "",
            redesSociales: answers.redesSociales || {
              facebook: "",
              instagram: "",
              tiktok: "",
            },
            rangoPrecios: answers.rangoPrecios || "",
            personalTotal: answers.personalTotal || 0,
            horarioOperacion: answers.horarioOperacion || [],
            numeroPlatosPrincipales: answers.numeroPlatosPrincipales || 0,
            presupuestoMarketing: answers.presupuestoMarketing || 0,
            historiaNegocio: "",
            valorDiferenciador: "",
            enfoqueMercado: "",
            // Keep default values for removed fields
            numeroClientesDiarios: 0,
            calificacionPromedio: 0,
          },
          establecimiento: {
            nombre: answers.nombreComercial,
            ubicacion: {
              direccion: answers.establecimiento?.direccion || "",
              ciudad: answers.establecimiento?.ciudad || "",
              estado: answers.establecimiento?.estado || "",
              codigoPostal: answers.establecimiento?.codigoPostal || "",
              zona: answers.establecimiento?.zona || "",
            },
          },
          programaLealtad: {
            niveles: [
              {
                nombre: "Bronce",
                nivel: 1,
                visitasRequeridas: 6,
                beneficios: [
                  { descripcion: "Beneficios nivel Bronce", activo: true },
                ],
              },
              {
                nombre: "Plata",
                nivel: 2,
                visitasRequeridas: 8,
                beneficios: [
                  { descripcion: "Beneficios nivel Plata", activo: true },
                ],
              },
              {
                nombre: "Oro",
                nivel: 3,
                visitasRequeridas: 12,
                beneficios: [
                  { descripcion: "Beneficios nivel Oro", activo: true },
                ],
              },
              {
                nombre: "Rubi",
                nivel: 4,
                visitasRequeridas: 15,
                beneficios: [
                  { descripcion: "Beneficios nivel Rubi", activo: true },
                ],
              },
            ],
            temporadaActual: {
              duracionMeses: 3,
              activa: true,
            },
          },
        };

        formData.append("profileData", JSON.stringify(profileData));
      }

      // Add profile photo if exists and it's a base64 string
      if (answers.fotoPerfil && answers.fotoPerfil.startsWith("data:image")) {
        const response = await fetch(answers.fotoPerfil);
        const blob = await response.blob();
        formData.append("fotoPerfil", blob, "profile.jpg");
      }

      const apiResponse = await apiClient.post(
        "/api/auth/setup-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return apiResponse.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al configurar el perfil";
      throw new Error(errorMessage);
    }
  },

  /**
   * Validates profile data before submission
   * @param {string} userType - Type of user (business or user)
   * @param {object} answers - Answers/data collected from the profile setup
   * @returns {object} - Validation result
   */
  validateProfileData: (userType, answers) => {
    const requiredFields =
      userType === "user"
        ? [
            "nombre",
            "fotoPerfil",
            "edad",
            "genero",
            "ciudad",
            "codigoPostal",
            "categoriasFavoritas",
          ]
        : [
            "nombreComercial",
            "fotoPerfil",
            "rfc",
            "categoria",
            "gradient",
            "establecimiento",
          ];

    const missingFields = requiredFields.filter((field) => !answers[field]);

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  },
};

export default profileService;
