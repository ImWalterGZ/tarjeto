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
import logo from "../assets/isotipo-red.png";
import { compressImage } from "../utils/image.compressor";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
} from "@mui/material";
import { gradients } from "../components/profile/BusinessPreview";
import { Undo2 } from "lucide-react";
import UserAddPhoto from "../assets/userAddPhoto.png";

function SetUpProfile() {
  const navigate = useNavigate();
  const { usuario } = useAuthStore();
  const [userType, setUserType] = useState(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

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
    if (!answers[currentQuestion.field] && currentQuestion.required) {
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
    console.log("handleAnswer called with:", { field, value });
    console.log("Previous answers state:", answers);
    setAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [field]: value,
      };
      console.log("Updated answers state:", newAnswers);
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Debug log for answers object
      console.log("Current answers state:", answers);
      console.log("Current step:", currentStep);
      console.log("Total steps:", preguntas.length);
      console.log("User type:", userType);

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
      console.log("Required fields:", requiredFields);
      console.log("Answers object keys:", Object.keys(answers));
      console.log("Answers object values:", Object.values(answers));

      const missingFields = requiredFields.filter((field) => {
        const isMissing = !answers[field];
        console.log(`Field ${field}:`, {
          exists: !!answers[field],
          value: answers[field],
          isMissing,
        });
        return isMissing;
      });

      if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields);
        toast.error("Por favor completa todos los campos requeridos");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();

      // Always set userType first
      console.log("Setting userType in formData:", userType);
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

        console.log("Sending client profile data:", profileData);
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

        console.log("Sending business profile data:", profileData);
        formData.append("profileData", JSON.stringify(profileData));
      }

      // Debug logs for request
      console.log("Final FormData contents:");
      for (let pair of formData.entries()) {
        console.log(
          pair[0] + ": ",
          typeof pair[1] === "string" ? pair[1] : "[Complex Data]"
        );
      }

      // Add profile photo if exists and it's a base64 string
      if (answers.fotoPerfil && answers.fotoPerfil.startsWith("data:image")) {
        console.log("Adding profile photo to request");
        const response = await fetch(answers.fotoPerfil);
        const blob = await response.blob();
        formData.append("fotoPerfil", blob, "profile.jpg");
      }

      console.log(
        "Sending request to /api/auth/setup-profile with userType:",
        userType
      );
      const response = await apiClient.post(
        "/api/auth/setup-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Server Response:", {
        status: response.status,
        data: response.data,
        headers: response.headers,
      });

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
      console.error("Error Details:", {
        message: error.message,
        name: error.name,
        code: error.code,
        response: {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        },
        request: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data,
        },
      });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al configurar el perfil";
      toast.error(errorMessage);
      console.error("Error al configurar perfil:", errorMessage);
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
            <TextField
              key={field.name}
              fullWidth
              label={field.label}
              type={field.type}
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#F2F2F2",
                  "& fieldset": {
                    borderColor: "#616161",
                    borderWidth: "2px",
                    borderRadius: "0.5rem",
                  },
                  "&:hover fieldset": {
                    borderColor: "#EF4444",
                    borderWidth: "2px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#EF4444",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#616161",
                  "&.Mui-focused": {
                    color: "#EF4444",
                  },
                },
              }}
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
                  console.log(reader.result);
                } catch (error) {
                  console.error("Error compressing image:", error);
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
            className="w-full max-w-md py-4 px-6 rounded-full border-2 border-red-500 flex items-center justify-center gap-2 cursor-pointer hover:bg-red-50 transition-colors"
          >
            <svg
              className="w-6 h-6 text-red-500"
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
            <span className="text-red-500 font-medium text-lg">Subir</span>
          </label>

          <button
            onClick={() => handleNext()}
            className="w-full h-12 max-w-md py-4 px-6 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-600 font-medium text-lg">Omitir</span>
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

    if (currentQuestion.type === "category") {
      return (
        <CategorySelector
          selectedCategories={answers[currentQuestion.field] || []}
          onChange={(value) => handleAnswer(value, currentQuestion.field)}
          maxSelections={userType === "business" ? 3 : 5}
        />
      );
    }

    if (currentQuestion.type === "select") {
      return (
        <FormControl fullWidth>
          <InputLabel
            sx={{
              color: "#616161",
              "&.Mui-focused": {
                color: "#EF4444",
              },
            }}
          >
            {currentQuestion.pregunta}
          </InputLabel>
          <Select
            value={answers[currentQuestion.field] || ""}
            onChange={(e) =>
              handleAnswer(e.target.value, currentQuestion.field)
            }
            required={currentQuestion.required}
            sx={{
              backgroundColor: "#F2F2F2",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#616161",
                borderWidth: "2px",
                borderRadius: "0.5rem",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#EF4444",
                borderWidth: "2px",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#EF4444",
                borderWidth: "2px",
              },
              "& .MuiSelect-icon": {
                color: "#616161",
              },
              "&:hover .MuiSelect-icon": {
                color: "#EF4444",
              },
            }}
          >
            {currentQuestion.opciones.map((opcion) => (
              <MenuItem key={opcion} value={opcion}>
                {opcion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (currentQuestion.type === "social") {
      return (
        <div className="space-y-4">
          {currentQuestion.opciones.map((red) => (
            <TextField
              key={red}
              fullWidth
              label={`URL de ${red}`}
              value={answers[currentQuestion.field]?.[red.toLowerCase()] || ""}
              onChange={(e) =>
                handleAnswer(
                  {
                    ...answers[currentQuestion.field],
                    [red.toLowerCase()]: e.target.value,
                  },
                  currentQuestion.field
                )
              }
              required={currentQuestion.required}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#F2F2F2",
                  "& fieldset": {
                    borderColor: "#616161",
                    borderWidth: "2px",
                    borderRadius: "0.5rem",
                  },
                  "&:hover fieldset": {
                    borderColor: "#EF4444",
                    borderWidth: "2px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#EF4444",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#616161",
                  "&.Mui-focused": {
                    color: "#EF4444",
                  },
                },
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <TextField
        fullWidth
        label={currentQuestion.pregunta}
        type={currentQuestion.type}
        value={answers[currentQuestion.field] || ""}
        onChange={(e) => handleAnswer(e.target.value, currentQuestion.field)}
        required={currentQuestion.required}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#F2F2F2",
            "& fieldset": {
              borderColor: "#616161",
              borderWidth: "2px",
              borderRadius: "0.5rem",
            },
            "&:hover fieldset": {
              borderColor: "#EF4444",
              borderWidth: "2px",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#EF4444",
              borderWidth: "2px",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#616161",
            "&.Mui-focused": {
              color: "#EF4444",
            },
          },
        }}
      />
    );
  };

  const progress = ((currentStep + 1) / preguntas.length) * 100;

  return (
    <div className="bg-red-primary w-screen h-screen relative flex items-center justify-center p-2 overflow-hidden">
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
            className="w-6/12 mt-8 bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!userType}
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
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        className="mb-4"
                        sx={{
                          backgroundColor: "#f3f4f6",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#EF4444",
                          },
                        }}
                      />

                      <div className="flex items-center justify-between mt-4">
                        <Button
                          onClick={handleBack}
                          sx={{
                            color: "#EF4444",
                            "&:hover": {
                              backgroundColor: "#5555",
                            },
                          }}
                        >
                          <Undo2 className="w-10 font-bold mr-3" />
                          {currentStep === 0 ? "Cambiar tipo" : "Atrás"}
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          disabled={isSubmitting}
                          sx={{
                            backgroundColor: "#EF4444",
                            "&:hover": {
                              backgroundColor: "#DC2626",
                            },
                          }}
                        >
                          {isSubmitting
                            ? "Enviando..."
                            : currentStep === preguntas.length - 1
                            ? "Finalizar"
                            : "Siguiente"}
                        </Button>
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
