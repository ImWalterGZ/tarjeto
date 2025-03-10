import { react, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";

function EmailVerificacion() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, cargando, verifyEmail } = useAuthStore();

  // Handle error display
  useEffect(() => {
    if (error && !hasError) {
      toast.error(error);
      setHasError(true);
    }
  }, [error]);

  // Reset error state when code changes
  useEffect(() => {
    if (hasError) {
      setHasError(false);
    }
  }, [code]);

  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value.slice(0, 1);
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || cargando) return;

    try {
      setIsSubmitting(true);
      setHasError(false);
      const verCode = code.join("");
      await verifyEmail(verCode);

      // If we get here, it means verification was successful
      toast.success("Email verificado correctamente");
      navigate("/setup-profile");
    } catch (error) {
      setHasError(true);

      // Get the current state from the store
      const currentState = useAuthStore.getState();

      // Check if we have a verified user despite the error
      if (
        currentState.usuario?.verificado ||
        (error.response?.status === 500 && currentState.usuario)
      ) {
        toast.success("Email verificado correctamente");
        navigate("/setup-profile");
        return;
      }

      // Only show error toast if there's no verified user
      if (!currentState.usuario?.verificado) {
        toast.error(
          error.response?.data?.message || "Error al verificar el email"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debounced auto-submit with error prevention
  useEffect(() => {
    let timer;
    if (
      code.every((digit) => digit !== "") &&
      !isSubmitting &&
      !cargando &&
      !hasError
    ) {
      timer = setTimeout(() => {
        handleSubmit(new Event("submit"));
      }, 500);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [code, isSubmitting, cargando, hasError]);

  return (
    <div className="bg-red-primary w-screen h-screen relative flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={"bg-white rounded-xl p-8 shadow-xl"}
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-red-primary text-transparent bg-clip-text">
          Verifica tu Email
        </h2>
        <p className="text-center text-black mb-6">
          Ingresa el codigo a 6 digitos que enviamos a tu correo
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isSubmitting || cargando}
                className="size-12 text-center text-2xl font-bold bg-gray-300 text-red-primary border-2 border-gray-400 rounded-xl focus:border-red-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            ))}
          </div>
          {error && hasError && (
            <p className="text-red-primary font-semibold mt-2">{error}</p>
          )}
          <motion.button
            className="mt-5 w-full py-4 px-4 bg-red-primary text-white font-bold rounded-full
                    shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2
                     focus:ring-red-primary focus:ring-offset-2 focus:ring-offset-white transition duration-200 focus:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting || cargando || code.some((digit) => !digit)}
          >
            {isSubmitting || cargando ? "Verificando..." : "Verificar Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default EmailVerificacion;
