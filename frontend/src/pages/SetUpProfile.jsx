import { react, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import IMAGES from "../assets/Images";

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
  LinearProgress
} from "@mui/material";

function SetUpProfile() {

  const [userType, setUserType] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers,setAnswers] = useState({});

  const preguntasNegocio = [
    {
      id: 1,
      pregunta: "¿Cuál es el nombre del negocio?",
      type: "text",
      respuesta: "",
    },
    {
      id: 2,
      pregunta: "¿Cuál es la dirección del negocio?",
      type: "text",
      respuesta: "",
    },
    {
      id: 3,
      pregunta: "¿Cuál es el teléfono del negocio?",
      type: "text",
      respuesta: "",
    },
    {
      id: 4,
      pregunta: "¿Que tipo de productos ofrece?",
      type: "select",
      opciones: ["Gastronomia", "Moda", "Tecnologia", "Salud", "Educación", "Entretenimiento", "Otros"],
      respuesta: "",
    },
    {
      id: 5,
      pregunta: "Conectar con redes sociales",
      type: "select",
      opciones: ["Facebook", "Instagram", "TikTok"],
      respuesta: "",
    },
    
  ];

  const preguntasUsuario = [
    {
      id: 1,
      pregunta: "¿Cómo te llamas?",
      type: "text",
      respuesta: "",
    },
    {
      id: 2,
      pregunta: "¿Cuántos años tienes?",
      type: "number",
      respuesta: "",
    },
    {
      id: 3,
      pregunta: "¿Cuál es tu género?",
      type: "text",
      respuesta: "",
    },
    {
      id: 4,
      pregunta: "¿Cuál es tu número de teléfono?",
      type: "text",
      respuesta: "",
    },
    {
      id: 5,
      pregunta: "¿Cuál es tu categoría favorita?",
      type: "select",
      opciones: ["Gastronomía", "Moda", "Tecnología", "Salud", "Educación", "Entretenimiento", "Otros"],
      respuesta: "",
    },
  ];

  const preguntas = userType === 'business' ? preguntasNegocio : preguntasUsuario;

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentStep]: value
    }));
  };

  const renderQuestion = () => {
    const currentQuestion = preguntas[currentStep];
    
    if (!currentQuestion) return null;

    if (currentQuestion.type === "select") {
      return (
        <FormControl fullWidth>
          <InputLabel>{currentQuestion.pregunta}</InputLabel>
          <Select
            value={answers[currentStep] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
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

    return (
      <TextField
        fullWidth
        label={currentQuestion.pregunta}
        type={currentQuestion.type}
        value={answers[currentStep] || ""}
        onChange={(e) => handleAnswer(e.target.value)}
      />
    );
  };

  const progress = (currentStep / preguntas.length) * 100;

  return (
    <div className="bg-red-primary w-screen h-screen relative flex items-center justify-center p-6 gap-6">
      <div className="bg-white w-full md:w-3/4  xl:w-4/6 h-full rounded-xl justify-center flex items-center">
        {!userType ? (
          <form className="w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-center font-nunito">Selecciona tu tipo de cuenta</h2>
            <div className="flex justify-center gap-8">
              <div 
                className="cursor-pointer text-center"
                onClick={() => setUserType('business')}
              >
                <img 
                  src={IMAGES.NEGOCIO_LOCAL}
                  alt="Negocio"
                  className={`w-32 h-32 object-cover rounded-lg transition-all duration-300 ${userType !== 'business' ? 'grayscale' : ''}`}
                />
                <p className={`mt-2 font-medium ${userType === 'business' ? 'text-red-primary' : 'text-gray-500'}`}>
                  Negocio
                </p>
              </div>
              <div 
                className="cursor-pointer text-center"
                onClick={() => setUserType('user')}
              >
                <img 
                  src={IMAGES.CLIENTE_PIC}
                  alt="Usuario" 
                  className={`w-32 h-32 object-cover rounded-lg transition-all duration-300 ${userType !== 'user' ? 'grayscale' : ''}`}
                />
                <p className={`mt-2 font-medium ${userType === 'user' ? 'text-red-primary' : 'text-gray-500'}`}>
                  Usuario
                </p>
              </div>
            </div>
          </form>
        ) : (
          <div className="w-full max-w-2xl flex flex-col  mx-auto p-6">
           
            
            <div className="mb-8">
              {renderQuestion()}
            </div>
            <Stepper activeStep={currentStep} orientation="horizontal" className="mb-8">
              {preguntas.map((_, index) => (
                <Step key={index}>
                  <StepLabel></StepLabel>
                </Step>
              ))}
            </Stepper>

            <div className="flex justify-between mt-4">
              <Button 
                onClick={handleBack} 
                disabled={currentStep === 0}
              >
                Atrás
              </Button>
              <Button 
                variant="contained" 
                onClick={handleNext}
                disabled={!answers[currentStep]}
              >
                {currentStep === preguntas.length - 1 ? 'Finalizar' : 'Siguiente'}
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white w-full md:w-1/2  xl:w-2/6 h-full rounded-xl">
        {/* El contenido del panel derecho será manejado externamente */}
      </div>
    </div>
  );
}

export default SetUpProfile;
