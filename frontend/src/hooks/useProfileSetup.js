import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import profileService from "../services/profileService";

export function useProfileSetup() {
  const navigate = useNavigate();
  const { usuario } = useAuthStore();
  const [userType, setUserType] = useState(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  // Questions for business users
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
      maxSelections: 3,
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

  // Questions for client users
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
      maxSelections: 5,
    },
  ];

  // Check if user is verified on initial load
  useEffect(() => {
    if (!usuario?.verificado) {
      navigate("/verify-email");
      return;
    }
  }, [usuario, navigate]);

  // Get the questions based on user type
  const getQuestions = () => {
    return userType === "business" ? preguntasNegocio : preguntasUsuario;
  };

  // Handle user type selection and start setup
  const handleStartSetup = () => {
    if (!userType) return;
    setIsExpanding(true);
    setTimeout(() => {
      setCurrentStep(0);
    }, 500);
  };

  // Handle going to next step or submitting
  const handleNext = async () => {
    const preguntas = getQuestions();
    const currentQuestion = preguntas[currentStep];

    // Special handling for composite fields
    if (currentQuestion.type === "business-metrics") {
      // Set a flag in answers to mark this section as completed
      if (!answers[currentQuestion.field]) {
        handleAnswer(true, currentQuestion.field);
      }
    }

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

  // Handle going back a step
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

  // Handle updating answers
  const handleAnswer = (value, field) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate profile data
      const { isValid, missingFields } = profileService.validateProfileData(
        userType,
        answers
      );

      if (!isValid) {
        toast.error("Por favor completa todos los campos requeridos");
        setIsSubmitting(false);
        return;
      }

      // Submit profile data
      const response = await profileService.setupProfile(userType, answers);

      if (response.success) {
        toast.success("¡Perfil configurado exitosamente!");
        navigate(
          userType === "business" ? "/negocio-dashboard" : "/cliente-dashboard"
        );
      } else {
        throw new Error(response.message || "Error al configurar el perfil");
      }
    } catch (error) {
      const errorMessage = error.message || "Error al configurar el perfil";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    userType,
    setUserType,
    currentStep,
    answers,
    isSubmitting,
    isExpanding,
    getQuestions,
    handleStartSetup,
    handleNext,
    handleBack,
    handleAnswer,
    handleSubmit,
  };
}

export default useProfileSetup;
