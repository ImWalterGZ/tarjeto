import { motion } from "framer-motion";
import FormStepper from "./FormStepper";
import QuestionRenderer from "./QuestionRenderer";
import ClientPreview from "../profile/ClientPreview";
import logo from "/images/isotipo-red.png";

function ClientSetup({
  answers,
  currentStep,
  isSubmitting,
  handleAnswer,
  handleNext,
  handleBack,
}) {
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
          <ClientPreview data={answers} />
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
                currentQuestion={preguntasUsuario[currentStep]}
                answers={answers}
                handleAnswer={handleAnswer}
              />
            </motion.div>

            <FormStepper
              currentStep={currentStep}
              totalSteps={preguntasUsuario.length}
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

export default ClientSetup;
