import { motion } from "framer-motion";
import { Undo2 } from "lucide-react";

function FormStepper({
  currentStep,
  totalSteps,
  handleBack,
  handleNext,
  isSubmitting,
  isFirstStep,
}) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
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
          {isFirstStep ? "Cambiar tipo" : "Atrás"}
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
            : currentStep === totalSteps - 1
            ? "Finalizar"
            : "Siguiente"}
        </button>
      </div>
    </motion.div>
  );
}

export default FormStepper;
