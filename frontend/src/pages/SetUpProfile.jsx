import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TypeSelector from "../components/setup/TypeSelector";
import BusinessSetup from "../components/setup/BusinessSetup";
import ClientSetup from "../components/setup/ClientSetup";
import useProfileSetup from "../hooks/useProfileSetup";

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
  const {
    userType,
    setUserType,
    currentStep,
    answers,
    isSubmitting,
    isExpanding,
    handleStartSetup,
    handleNext,
    handleBack,
    handleAnswer,
  } = useProfileSetup();

  useEffect(() => {
    if (!usuario?.verificado) {
      navigate("/verify-email");
      return;
    }
  }, [usuario, navigate]);

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
        {/* Type Selector */}
        <motion.div
          animate={{
            opacity: currentStep > -1 ? 0 : 1,
            scale: currentStep > -1 ? 0.8 : 1,
          }}
          transition={{ duration: 0.3 }}
          className={currentStep > -1 ? "hidden" : ""}
        >
          <TypeSelector
            userType={userType}
            setUserType={setUserType}
            handleStartSetup={handleStartSetup}
          />
        </motion.div>

        {/* Setup Forms */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: currentStep > -1 ? 1 : 0,
            scale: currentStep > -1 ? 1 : 0.8,
          }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className={`${currentStep > -1 ? "block" : "hidden"} w-full h-full`}
        >
          {userType === "business" ? (
            <BusinessSetup
              answers={answers}
              currentStep={currentStep}
              isSubmitting={isSubmitting}
              handleAnswer={handleAnswer}
              handleNext={handleNext}
              handleBack={handleBack}
            />
          ) : (
            <ClientSetup
              answers={answers}
              currentStep={currentStep}
              isSubmitting={isSubmitting}
              handleAnswer={handleAnswer}
              handleNext={handleNext}
              handleBack={handleBack}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SetUpProfile;
