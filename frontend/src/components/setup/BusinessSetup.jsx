import { motion } from "framer-motion";
import FormStepper from "./FormStepper";
import QuestionRenderer from "./QuestionRenderer";
import BusinessPreview from "../profile/BusinessPreview";
import logo from "/images/isotipo-red.png";

function BusinessSetup({
  answers,
  currentStep,
  isSubmitting,
  handleAnswer,
  handleNext,
  handleBack,
}) {
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

  return (
    <>
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
          <BusinessPreview data={answers} />
        </motion.div>
      </motion.div>

      <div className="flex flex-col h-full px-12 align-middle items-center justify-center gap-14">
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
            <motion.div
              layout="position"
              transition={{
                layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
              }}
              className="mb-8"
            >
              <QuestionRenderer
                currentQuestion={preguntasNegocio[currentStep]}
                answers={answers}
                handleAnswer={handleAnswer}
              />
            </motion.div>

            <FormStepper
              currentStep={currentStep}
              totalSteps={preguntasNegocio.length}
              handleBack={handleBack}
              handleNext={handleNext}
              isSubmitting={isSubmitting}
              isFirstStep={currentStep === 0}
            />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default BusinessSetup;
