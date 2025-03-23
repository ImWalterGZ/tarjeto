import { react, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import IMAGES from "../assets/Images";
import apiClient from "../config/axios";
import BusinessPreview from "../components/profile/BusinessPreview";
import ClientPreview from "../components/profile/ClientPreview";
import CategorySelector from "../components/profile/CategorySelector";
import logo from "/images/isotipo-red.png";
import { compressImage } from "../utils/image.compressor";
import { gradients } from "../components/profile/BusinessPreview";
import { Undo2 } from "lucide-react";
import UserAddPhoto from "/images/userAddPhoto.png";

// Add inline styles to enforce red primary color
const styleOverrides = `
  .btn-primary {
    background-color: #F4262F !important;
    border-color: #F4262F !important;
    box-shadow: none !important;
    color: #FFFFFF !important;
  }
  
  .btn-primary:hover {
    background-color: #DC2626 !important;
    border-color: #DC2626 !important;
    color: #FFFFFF !important;
  }
  
  .btn-primary:focus, 
  .btn-primary:focus-visible {
    outline: 2px solid #F4262F !important;
    outline-offset: 2px !important;
    box-shadow: 0 0 0 2px rgba(244, 38, 47, 0.4) !important;
    color: #FFFFFF !important;
  }
  
  /* Force specific button colors */
  button.btn-primary {
    color: #FFFFFF !important;
  }
  
  .btn-outline:focus,
  .btn-outline:focus-visible {
    outline: 2px solid #F4262F !important;
    outline-offset: 2px !important;
    box-shadow: 0 0 0 2px rgba(244, 38, 47, 0.4) !important;
  }
  
  /* Remove focus rings and shadows from all buttons */
  .btn {
    --focus-shadow: 0 0 0 2px rgba(244, 38, 47, 0.4) !important;
    --btn-focus-scale: 0.97 !important;
  }
  
  /* Progress bar override */
  .progress-error {
    --progress-color: #F4262F !important;
  }
  
  .progress {
    background-color: rgba(244, 38, 47, 0.2) !important;
  }
  
  .progress::-webkit-progress-value {
    background-color: #F4262F !important;
  }
  
  .progress::-moz-progress-bar {
    background-color: #F4262F !important;
  }
  
  .progress:indeterminate::after {
    background-color: #F4262F !important;
  }
  
  /* Range slider overrides */
  .range-primary {
    --range-shdw: #F4262F !important;
  }
  
  .range-primary::-webkit-slider-thumb {
    background-color: #F4262F !important;
    border-color: #F4262F !important;
    box-shadow: 0 0 0 2px #F4262F !important;
  }
  
  .range-primary::-moz-range-thumb {
    background-color: #F4262F !important;
    border-color: #F4262F !important;
    box-shadow: 0 0 0 2px #F4262F !important;
  }
  
  .range-primary::-webkit-slider-runnable-track {
    background-color: #F4262F !important;
  }
  
  .range-primary::-moz-range-track {
    background-color: #F4262F !important;
  }
  
  .range-primary:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 2px #F4262F !important;
  }
  
  .range-primary:focus::-moz-range-thumb {
    box-shadow: 0 0 0 2px #F4262F !important;
  }
  
  /* Custom red range class */
  .red-range::-webkit-slider-thumb {
    background-color: #F4262F !important;
  }
  
  .red-range::-moz-range-thumb {
    background-color: #F4262F !important;
  }
  
  .red-range::-webkit-slider-runnable-track {
    background-image: linear-gradient(to right, #F4262F, #F4262F) !important;
    background-size: var(--range-progress, 0%) 100% !important;
    background-repeat: no-repeat !important;
  }
  
  /* Toggle overrides */
  .toggle-primary:checked {
    background-color: #F4262F !important;
    border-color: #F4262F !important;
  }
  
  .toggle-primary:focus-visible {
    outline-color: #F4262F !important;
  }
`;

function SetUpProfile() {
  const navigate = useNavigate();
  const { usuario } = useAuthStore();
  const [userType, setUserType] = useState(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  // Helper functions for specific field types
  const getHorario = (dia, campo) => {
    if (!answers.horarioOperacion) return "";
    const horarioDia = answers.horarioOperacion.find((h) => h.dia === dia);
    return horarioDia ? horarioDia[campo] : "";
  };

  const updateHorario = (dia, campo, valor) => {
    setAnswers((prev) => {
      const horarioOperacion = [...(prev.horarioOperacion || [])];
      const index = horarioOperacion.findIndex((h) => h.dia === dia);

      if (index >= 0) {
        horarioOperacion[index] = {
          ...horarioOperacion[index],
          [campo]: valor,
        };
      } else {
        horarioOperacion.push({ dia, [campo]: valor });
      }

      return { ...prev, horarioOperacion };
    });
  };

  // Apply preset schedules to all days or specific days
  const applyPresetHorario = (preset) => {
    const dias = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];

    let nuevoHorario = [];

    switch (preset) {
      case "fullDay":
        // 8:00 - 20:00 todos los días
        dias.forEach((dia) => {
          nuevoHorario.push({ dia, apertura: "08:00", cierre: "20:00" });
        });
        break;
      case "halfDay":
        // 8:00 - 14:00 todos los días
        dias.forEach((dia) => {
          nuevoHorario.push({ dia, apertura: "08:00", cierre: "14:00" });
        });
        break;
      case "noWeekends":
        // 8:00 - 18:00 de lunes a viernes, cerrado en fin de semana
        dias.forEach((dia) => {
          if (dia === "Sábado" || dia === "Domingo") {
            nuevoHorario.push({ dia, apertura: "", cierre: "" });
          } else {
            nuevoHorario.push({ dia, apertura: "08:00", cierre: "18:00" });
          }
        });
        break;
    }

    setAnswers((prev) => ({
      ...prev,
      horarioOperacion: nuevoHorario,
    }));
  };

  useEffect(() => {
    if (!usuario?.verificado) {
      navigate("/verify-email");
      return;
    }
  }, [usuario, navigate]);

  const preguntasNegocio = [
    {
      id: 1,
      pregunta: "¿Cuál es el nombre de tu negocio?",
      type: "text",
      field: "nombreComercial",
      required: true,
    },
    {
      id: 2,
      pregunta: "Sube tu foto de perfil",
      type: "image",
      field: "fotoPerfil",
      required: true,
    },
    {
      id: 3,
      pregunta: "¿Cuál es el RFC?",
      type: "text",
      field: "rfc",
      required: true,
    },
    {
      id: 4,
      pregunta: "Selecciona las categorías de tu negocio",
      type: "category",
      field: "categoria",
      required: true,
    },
    {
      id: 5,
      pregunta: "Personaliza el estilo de tu tarjeta",
      type: "gradient",
      field: "gradient",
      required: true,
    },
    {
      id: 6,
      pregunta: "¿Cuál es tu sitio web? (opcional)",
      type: "url",
      field: "sitioWeb",
      required: false,
    },
    {
      id: 7,
      pregunta: "Redes sociales (opcional)",
      type: "social",
      field: "redesSociales",
      opciones: ["Facebook", "Instagram", "TikTok"],
      required: false,
    },
    {
      id: 8,
      pregunta: "Información de tu establecimiento principal",
      type: "establishment",
      field: "establecimiento",
      required: true,
      fields: [
        {
          name: "direccion",
          label: "Dirección",
          type: "text",
          required: true,
        },
        {
          name: "ciudad",
          label: "Ciudad",
          type: "text",
          required: true,
        },
        {
          name: "estado",
          label: "Estado",
          type: "text",
          required: true,
        },
        {
          name: "codigoPostal",
          label: "Código Postal",
          type: "text",
          required: true,
        },
        {
          name: "zona",
          label: "Zona o Colonia",
          type: "text",
          required: true,
        },
      ],
    },
    {
      id: 9,
      pregunta: "¿Cuál es tu rango de precios?",
      type: "price-range",
      field: "rangoPrecios",
      required: true,
    },
    {
      id: 10,
      pregunta: "¿Cuántos empleados tiene tu negocio?",
      type: "range",
      field: "personalTotal",
      min: 0,
      max: 100,
      required: true,
    },
    {
      id: 11,
      pregunta: "Horario de operación",
      type: "operating-hours",
      field: "horarioOperacion",
      required: true,
    },
    {
      id: 12,
      pregunta: "Información adicional",
      type: "business-metrics",
      field: "business-metrics",
      required: true,
    },
  ];

  const preguntasUsuario = [
    {
      id: 1,
      pregunta: "¿Cuál es tu nombre completo?",
      type: "text",
      field: "nombre",
      required: true,
    },
    {
      id: 2,
      pregunta: "Sube tu foto de perfil",
      type: "image",
      field: "fotoPerfil",
      required: true,
    },
    {
      id: 3,
      pregunta: "¿Cuántos años tienes?",
      type: "number",
      field: "edad",
      required: true,
    },
    {
      id: 4,
      pregunta: "¿Cuál es tu género?",
      type: "select",
      field: "genero",
      opciones: ["Masculino", "Femenino", "Otro", "Prefiero no decir"],
      required: true,
    },
    {
      id: 5,
      pregunta: "¿En qué ciudad vives?",
      type: "text",
      field: "ciudad",
      required: true,
    },
    {
      id: 6,
      pregunta: "¿Cuál es tu código postal?",
      type: "text",
      field: "codigoPostal",
      required: true,
    },
    {
      id: 7,
      pregunta: "Selecciona tus categorías favoritas",
      type: "category",
      field: "categoriasFavoritas",
      required: true,
    },
  ];

  const preguntas =
    userType === "business" ? preguntasNegocio : preguntasUsuario;

  const handleNext = async () => {
    const currentQuestion = preguntas[currentStep];
    console.log("Current step:", currentStep);
    console.log("Current field:", currentQuestion.field);
    console.log("Field value:", answers[currentQuestion.field]);
    console.log("Required:", currentQuestion.required);
    console.log("Total steps:", preguntas.length);
    console.log("Is last step:", currentStep === preguntas.length - 1);

    // Special handling for composite fields
    if (currentQuestion.type === "business-metrics") {
      // Set a flag in answers to mark this section as completed
      if (!answers[currentQuestion.field]) {
        handleAnswer(true, currentQuestion.field);
      }
    }

    if (!answers[currentQuestion.field] && currentQuestion.required) {
      console.log("Validation failed for field:", currentQuestion.field);
      toast.error("Por favor completa este campo");
      return;
    }

    if (currentStep === preguntas.length - 1) {
      await handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      setUserType(null);
      setAnswers({});
      setCurrentStep(-1);
      setIsExpanding(false);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleAnswer = (value, field) => {
    // console.log("handleAnswer called with:", { field, value });
    // console.log("Previous answers state:", answers);
    setAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [field]: value,
      };
      // console.log("Updated answers state:", newAnswers);
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Debug log for answers object
      console.log("FINAL ANSWERS:", answers);

      // Validate all required fields
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

      // Debug log for required fields validation
      // console.log("Required fields:", requiredFields);
      // console.log("Answers object keys:", Object.keys(answers));
      // console.log("Answers object values:", Object.values(answers));

      const missingFields = requiredFields.filter((field) => {
        const isMissing = !answers[field];
        // console.log(`Field ${field}:`, {
        //   exists: !!answers[field],
        //   value: answers[field],
        //   isMissing,
        // });
        return isMissing;
      });

      if (missingFields.length > 0) {
        // console.error("Missing required fields:", missingFields);
        toast.error("Por favor completa todos los campos requeridos");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();

      // Always set userType first
      // console.log("Setting userType in formData:", userType);
      formData.append("userType", userType);

      if (userType === "user") {
        // Structure the data according to the backend's expected format for clients
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

        // console.log("Sending client profile data:", profileData);
        formData.append("profileData", JSON.stringify(profileData));
      } else {
        // Structure business data according to the backend's expected format
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

        // console.log("Sending business profile data:", profileData);
        formData.append("profileData", JSON.stringify(profileData));
      }

      // Debug logs for request
      // console.log("Final FormData contents:");
      // for (let pair of formData.entries()) {
      //   console.log(
      //     pair[0] + ": ",
      //     typeof pair[1] === "string" ? pair[1] : "[Complex Data]"
      //   );
      // }

      // Add profile photo if exists and it's a base64 string
      if (answers.fotoPerfil && answers.fotoPerfil.startsWith("data:image")) {
        // console.log("Adding profile photo to request");
        const response = await fetch(answers.fotoPerfil);
        const blob = await response.blob();
        formData.append("fotoPerfil", blob, "profile.jpg");
      }

      // console.log(
      //   "Sending request to /api/auth/setup-profile with userType:",
      //   userType
      // );
      const response = await apiClient.post(
        "/api/auth/setup-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("Server Response:", {
      //   status: response.status,
      //   data: response.data,
      //   headers: response.headers,
      // });

      if (response.data.success) {
        toast.success("¡Perfil configurado exitosamente!");
        navigate(
          userType === "business" ? "/negocio-dashboard" : "/cliente-dashboard"
        );
      } else {
        throw new Error(
          response.data.message || "Error al configurar el perfil"
        );
      }
    } catch (error) {
      // console.error("Error Details:", {
      //   message: error.message,
      //   name: error.name,
      //   code: error.code,
      //   response: {
      //     status: error.response?.status,
      //     data: error.response?.data,
      //     headers: error.response?.headers,
      //     },
      //     request: {
      //       url: error.config?.url,
      //       baseURL: error.config?.baseURL,
      //       method: error.config?.method,
      //       headers: error.config?.headers,
      //       data: error.config?.data,
      //     },
      // });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al configurar el perfil";
      toast.error(errorMessage);
      // console.error("Error al configurar perfil:", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartSetup = () => {
    if (!userType) return;
    setIsExpanding(true);
    setTimeout(() => {
      setCurrentStep(0);
    }, 500);
  };

  const renderQuestion = () => {
    const currentQuestion = preguntas[currentStep];

    if (!currentQuestion) return null;

    if (currentQuestion.type === "establishment") {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQuestion.pregunta}
          </h2>
          {currentQuestion.fields.map((field) => (
            <input
              key={field.name}
              type={field.type}
              placeholder={field.label}
              className="input input-bordered w-full"
              value={answers[currentQuestion.field]?.[field.name] || ""}
              onChange={(e) =>
                handleAnswer(
                  {
                    ...answers[currentQuestion.field],
                    [field.name]: e.target.value,
                  },
                  currentQuestion.field
                )
              }
              required={field.required}
            />
          ))}
        </div>
      );
    }

    if (currentQuestion.type === "image") {
      return (
        <div className="flex flex-col items-center justify-center gap-8 w-full">
          <h2 className="text-2xl font-semibold text-gray-800">
            Sube una foto de ti, no te vamos a criticar
          </h2>
          <h3 className="-mt-4 text-sm text-gray-500">tanto...</h3>

          <input
            type="file"
            id={currentQuestion.field}
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                try {
                  toast.loading("Procesando imagen...", {
                    id: "imageProcessing",
                  });

                  const compressedFile = await compressImage(file);

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    handleAnswer(reader.result, currentQuestion.field);
                    toast.success("Imagen subida correctamente", {
                      id: "imageProcessing",
                    });
                  };
                  reader.onerror = () => {
                    toast.error("Error al procesar la imagen", {
                      id: "imageProcessing",
                    });
                  };
                  reader.readAsDataURL(compressedFile);
                  // console.log(reader.result);
                } catch (error) {
                  // console.error("Error compressing image:", error);
                  toast.error("Error al procesar la imagen", {
                    id: "imageProcessing",
                  });
                }
              }
            }}
            className="hidden"
          />

          <label
            htmlFor={currentQuestion.field}
            className="btn  btn-error w-full max-w-md"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
              />
            </svg>
            <span>Subir</span>
          </label>

          <button
            onClick={() => handleNext()}
            className="btn btn-ghost w-full max-w-md"
          >
            <span>Omitir</span>
          </button>
        </div>
      );
    }

    if (currentQuestion.type === "gradient") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(gradients).map(([name, gradient]) => (
              <motion.button
                key={name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(name, currentQuestion.field)}
                className={`relative h-24 rounded-xl overflow-hidden border-2 transition-all ${
                  answers[currentQuestion.field] === name
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
                />
                <div className="relative h-full w-full flex items-center justify-center">
                  <span className="text-white font-medium capitalize">
                    {name}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      );
    }

    if (currentQuestion.type === "price-range") {
      return (
        <div className="form-control" data-theme="light">
          <label className="label">
            <span className="label-text text-lg">
              {currentQuestion.pregunta}
            </span>
          </label>
          <div className="flex justify-center gap-3">
            {[
              { value: "low", label: "60 - 199" },
              { value: "mid", label: "200 - 245" },
              { value: "high", label: "250 - 449" },
              { value: "premium", label: "500+" },
            ].map((range) => (
              <button
                key={range.value}
                type="button"
                className={`btn ${
                  answers[currentQuestion.field] === range.value
                    ? "btn-primary"
                    : ""
                } flex-1`}
                onClick={() => handleAnswer(range.value, currentQuestion.field)}
                style={
                  answers[currentQuestion.field] === range.value
                    ? { color: "#E0E0E0" }
                    : {}
                }
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentQuestion.type === "range") {
      // Create a mapping between slider position and employee count values
      const employeeCountMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30, 50];

      // Get the displayed value from the map or use default
      const getDisplayValue = (sliderPosition) => {
        if (!sliderPosition) return 0;
        const position = parseInt(sliderPosition);
        const value = employeeCountMap[position - 1];
        return position === employeeCountMap.length ? value + "+" : value;
      };

      // Get slider position from actual value (for setting initial value)
      const getSliderPosition = (actualValue) => {
        if (!actualValue) return 1;
        const position =
          employeeCountMap.findIndex((val) => actualValue <= val) + 1;
        return position > 0 ? position : employeeCountMap.length;
      };

      // Current slider position (not the actual value)
      const currentPosition = answers[currentQuestion.field + "_position"] || 1;

      // Current display value based on the position
      const displayValue = getDisplayValue(currentPosition);

      return (
        <div className="form-control" data-theme="light">
          <label className="label">
            <span className="label-text text-lg">
              {currentQuestion.pregunta}
            </span>
            <span className="label-text-alt font-medium text-gray-700">
              {displayValue} empleados
            </span>
          </label>
          <input
            type="range"
            min="1"
            max={employeeCountMap.length}
            step="1"
            value={currentPosition}
            onChange={(e) => {
              const sliderPosition = parseInt(e.target.value);
              const actualValue = employeeCountMap[sliderPosition - 1];

              // Store both the position and the actual value
              handleAnswer(sliderPosition, currentQuestion.field + "_position");
              handleAnswer(actualValue, currentQuestion.field);
            }}
            className="range range-primary range-lg w-full red-range py-7"
            style={{
              "--range-shdw": "#F4262F",
              "--range-color": "#FEF2F2",
            }}
          />
          <div className="w-full flex justify-between text-xs px-2 mt-2">
            {employeeCountMap.map((value, index) => (
              <span key={index} className="font-medium">
                {index === employeeCountMap.length - 1 ? "50+" : value}
              </span>
            ))}
          </div>
        </div>
      );
    }

    if (currentQuestion.type === "operating-hours") {
      return (
        <div className="form-control" data-theme="light">
          <label className="label">
            <span className="label-text text-lg">
              {currentQuestion.pregunta}
            </span>
          </label>

          {/* Preset Schedule Buttons */}
          <div className="my-4">
            <p className="text-sm text-gray-500 mb-2">
              Selecciona un horario común o define uno personalizado:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-sm "
                onClick={() => applyPresetHorario("fullDay")}
              >
                Jornada completa (8:00-20:00)
              </button>
              <button
                type="button"
                className="btn btn-sm "
                onClick={() => applyPresetHorario("halfDay")}
              >
                Media jornada (8:00-14:00)
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            {[
              "Lunes",
              "Martes",
              "Miércoles",
              "Jueves",
              "Viernes",
              "Sábado",
              "Domingo",
            ].map((day) => {
              const apertura = getHorario(day, "apertura");
              const cierre = getHorario(day, "cierre");
              const isClosed = !apertura && !cierre;

              return (
                <div key={day} className="flex items-center gap-2">
                  <span className="w-24 text-sm font-medium">{day}</span>

                  {/* Toggle for open/closed */}
                  <div className="form-control mr-2">
                    <label className="label cursor-pointer p-0">
                      <input
                        type="checkbox"
                        className="toggle toggle-xs"
                        checked={!isClosed}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Set default hours if toggling to open
                            updateHorario(day, "apertura", "09:00");
                            updateHorario(day, "cierre", "18:00");
                          } else {
                            // Clear hours if toggling to closed
                            updateHorario(day, "apertura", "");
                            updateHorario(day, "cierre", "");
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Time inputs */}
                  {!isClosed ? (
                    <>
                      <input
                        type="time"
                        className="input input-bordered input-sm w-28"
                        value={apertura}
                        onChange={(e) =>
                          updateHorario(day, "apertura", e.target.value)
                        }
                      />
                      <span>a</span>
                      <input
                        type="time"
                        className="input input-bordered input-sm w-28"
                        value={cierre}
                        onChange={(e) =>
                          updateHorario(day, "cierre", e.target.value)
                        }
                      />
                    </>
                  ) : (
                    <span className="text-sm italic text-gray-500">
                      Cerrado
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (currentQuestion.type === "business-metrics") {
      // Define budget ranges for marketing budget slider
      const marketingBudgetRanges = [1000, 2000, 3000, 5000, 7500, 10000];

      console.log("Rendering business-metrics section");

      // Mark this section as completed
      if (!answers[currentQuestion.field] && currentQuestion.required) {
        handleAnswer(true, currentQuestion.field);
      }

      // Get displayed value for marketing budget
      const getMarketingBudgetValue = (sliderPosition) => {
        if (!sliderPosition) return 0;
        const position = parseInt(sliderPosition);
        const value = marketingBudgetRanges[position - 1];
        return position === marketingBudgetRanges.length ? value + "+" : value;
      };

      // Current displayed values
      const marketingBudgetValue = getMarketingBudgetValue(
        answers.marketingBudgetPosition || 1
      );

      return (
        <div className="space-y-6" data-theme="light">
          <h2 className="text-xl font-semibold text-gray-800">
            Información adicional
          </h2>

          {/* Featured Products - Slider */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Número de productos/platos principales
              </span>
              <span className="label-text-alt font-medium text-gray-700">
                {answers.numeroPlatosPrincipales || 1}
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={answers.numeroPlatosPrincipales || 1}
              onChange={(e) => {
                handleAnswer(
                  parseInt(e.target.value),
                  "numeroPlatosPrincipales"
                );
                // Also mark the parent field as completed
                handleAnswer(true, currentQuestion.field);
              }}
              className="range range-primary w-full red-range"
              style={{
                "--range-shdw": "#F4262F",
                "--range-color": "#F4262F",
              }}
            />
            <div className="w-full flex justify-between text-xs px-2 mt-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <span key={num} className="font-medium">
                  {num}
                </span>
              ))}
            </div>
          </div>

          {/* Marketing Budget - Slider */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Presupuesto mensual para marketing (MXN)
              </span>
              <span className="label-text-alt font-medium text-gray-700">
                ${marketingBudgetValue}
              </span>
            </label>
            <input
              type="range"
              min="1"
              max={marketingBudgetRanges.length}
              step="1"
              value={answers.marketingBudgetPosition || 1}
              onChange={(e) => {
                const position = parseInt(e.target.value);
                const actualValue = marketingBudgetRanges[position - 1];

                // Store both the position and actual value
                handleAnswer(position, "marketingBudgetPosition");
                handleAnswer(actualValue, "presupuestoMarketing");
                // Also mark the parent field as completed
                handleAnswer(true, currentQuestion.field);
              }}
              className="range range-primary w-full red-range"
              style={{
                "--range-shdw": "#F4262F",
                "--range-color": "#F4262F",
              }}
            />
            <div className="w-full flex justify-between text-xs px-2 mt-2">
              {marketingBudgetRanges.map((value, index) => (
                <span key={index} className="font-medium">
                  {index === 0
                    ? "$1K"
                    : index === marketingBudgetRanges.length - 1
                    ? "$10K+"
                    : value >= 10000
                    ? "$" + value / 1000 + "K"
                    : "$" + value / 1000 + "K"}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentQuestion.type === "category") {
      return (
        <div data-theme="light">
          <CategorySelector
            selectedCategories={answers[currentQuestion.field] || []}
            onChange={(value) => handleAnswer(value, currentQuestion.field)}
            maxSelections={userType === "business" ? 3 : 5}
          />
        </div>
      );
    }

    if (currentQuestion.type === "select") {
      return (
        <div className="form-control w-full" data-theme="light">
          <label className="label">
            <span className="label-text">{currentQuestion.pregunta}</span>
          </label>
          <select
            className="select select-bordered"
            value={answers[currentQuestion.field] || ""}
            onChange={(e) =>
              handleAnswer(e.target.value, currentQuestion.field)
            }
          >
            <option disabled value="">
              Selecciona una opción
            </option>
            {currentQuestion.opciones.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (currentQuestion.type === "social") {
      return (
        <div className="space-y-4" data-theme="light">
          {currentQuestion.opciones.map((red) => (
            <div key={red} className="form-control">
              <label className="label">
                <span className="label-text">URL de {red}</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={
                  answers[currentQuestion.field]?.[red.toLowerCase()] || ""
                }
                onChange={(e) =>
                  handleAnswer(
                    {
                      ...answers[currentQuestion.field],
                      [red.toLowerCase()]: e.target.value,
                    },
                    currentQuestion.field
                  )
                }
              />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="form-control w-full" data-theme="light">
        <label className="label">
          <span className="label-text">{currentQuestion.pregunta}</span>
        </label>
        <input
          type={currentQuestion.type || "text"}
          className="input input-bordered w-full"
          value={answers[currentQuestion.field] || ""}
          onChange={(e) => handleAnswer(e.target.value, currentQuestion.field)}
          required={currentQuestion.required}
        />
      </div>
    );
  };

  const progress = ((currentStep + 1) / preguntas.length) * 100;

  return (
    <div
      className="bg-red-primary w-screen h-screen relative flex items-center justify-center p-2 overflow-hidden"
      data-theme="light"
      style={{
        "--p": "244 38 47" /* RGB values for #F4262F */,
        "--pf": "220 38 38" /* RGB values for #DC2626 - focus color */,
        "--pc": "255 255 255" /* white text color */,
        "--focus-ring": "0 0 0 2px rgba(244, 38, 47, 0.2)",
        "--focus-shadow": "0 0 0 2px rgba(244, 38, 47, 0.4)",
        "--btn-focus-scale": "0.97",
        "--btn-text-case": "none",
        "--btn-color": "#FFFFFF",
        "--progress-color": "#F4262F",
        "--progress-background": "rgba(244, 38, 47, 0.2)",
        "--er": "244 38 47" /* Error color in RGB format */,
      }}
    >
      <style>{styleOverrides}</style>
      <motion.div
        initial={false}
        animate={{
          width: isExpanding || currentStep > -1 ? "60%" : "90%",
          height: "90%",
          x: isExpanding || currentStep > -1 ? "-30%" : 0,
          position: "relative",
          borderRadius: "0.75rem",
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
        }}
        className="bg-white"
      >
        <motion.div
          animate={{
            opacity: currentStep > -1 ? 0 : 1,
            scale: currentStep > -1 ? 0.8 : 1,
          }}
          transition={{ duration: 0.3 }}
          className={`${
            currentStep > -1
              ? "hidden"
              : "flex flex-col items-center justify-center h-full"
          } p-8`}
        >
          <img src={logo} alt="Tarjeto" className="h-8 mb-8" />
          <div className="flex flex-col gap-4 w-full max-w-md">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUserType("user")}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                ${
                  userType === "user"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-200 hover:bg-red-50"
                }`}
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Soy un cliente</p>
                <p className="text-sm text-gray-500">
                  Quiero acumular puntos y recibir recompensas
                </p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUserType("business")}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                ${
                  userType === "business"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-200 hover:bg-red-50"
                }`}
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 21H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 7H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 7V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18 7V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 4L4 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 4L20 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Soy un negocio</p>
                <p className="text-sm text-gray-500">
                  Quiero fidelizar clientes y crear recompensas
                </p>
              </div>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartSetup}
            className="btn btn-primary w-6/12 mt-8"
            disabled={!userType}
            data-theme="light"
            style={{ boxShadow: "none", color: "#FFFFFF" }}
          >
            Siguiente
          </motion.button>
        </motion.div>

        {currentStep > -1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-0 right-0 transform translate-x-[105%] h-full w-[55%]"
          >
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white w-full h-full rounded-xl px-8 py-10 flex flex-col items-center justify-center"
            >
              {userType === "business" ? (
                <BusinessPreview data={answers} />
              ) : (
                <ClientPreview data={answers} />
              )}
            </motion.div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: currentStep > -1 ? 1 : 0,
            scale: currentStep > -1 ? 1 : 0.8,
          }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className={`${currentStep > -1 ? "block" : "hidden"} w-full h-full`}
        >
          <div className="flex flex-col h-full px-12 align-middle items-center justify-center gap-14 ">
            <motion.img
              src={logo}
              className="object-contain w-auto pl-4 h-9"
              alt="Logo"
              layout
              transition={{
                layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                y: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
              }}
              initial={false}
              animate={{
                y: currentStep > -1 ? 0 : 20,
                scale: currentStep > -1 ? 1 : 1.2,
              }}
            />
            <motion.div
              layout
              className="bg-gray-background w-full max-w-2xl mx-auto p-4 rounded-xl"
              transition={{
                layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
              }}
            >
              <motion.div
                layout
                className="bg-white rounded-xl p-6 shadow-xl"
                transition={{
                  layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                }}
              >
                {currentStep >= 0 && preguntas[currentStep] && (
                  <>
                    <motion.div
                      layout="position"
                      transition={{
                        layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                      }}
                      className="mb-8"
                    >
                      {renderQuestion()}
                    </motion.div>
                    <motion.div
                      layout="position"
                      transition={{
                        layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                      }}
                    >
                      <progress
                        className="progress progress-primary w-full"
                        value={progress}
                        max="100"
                        style={{
                          "--progress-color": "#F4262F",
                          "--progress-background": "rgba(244, 38, 47, 0.2)",
                        }}
                      ></progress>

                      <div className="flex items-center justify-between mt-4">
                        <button
                          onClick={handleBack}
                          className="btn"
                          data-theme="light"
                          style={{ boxShadow: "none" }}
                        >
                          <Undo2 className="w-5 mr-2" />
                          {currentStep === 0 ? "Cambiar tipo" : "Atrás"}
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={isSubmitting}
                          className="btn btn-primary"
                          data-theme="light"
                          style={{ boxShadow: "none", color: "#FFFFFF" }}
                        >
                          {isSubmitting
                            ? "Enviando..."
                            : currentStep === preguntas.length - 1
                            ? "Finalizar"
                            : "Siguiente"}
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SetUpProfile;
