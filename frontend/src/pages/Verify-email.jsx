import { react, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";

function EmailVerificacion() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [alertShown, setAlertShown] = useState(false);

  const { error, cargando, verifyEmail } = useAuthStore();

  useEffect(() => {
    if (error && !alertShown) {
      toast.error(error);
      setAlertShown(true);
    }
  }, [error, alertShown]);

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
      newCode[index] = value.slice(0, 1); // Ensure only one character is stored
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Added 'e' parameter
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verCode = code.join("");
    await verifyEmail(verCode);
    if (!error) {
      navigate("/setup-profile");
    }
  };

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]); // Added dependency array

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
                maxLength="1" // Change maxLength to 1 for single character input
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)} // Pass 'e'
                className="size-12 text-center text-2xl font-bold bg-gray-300 text-red-primary border-2 border-gray-400 rounded-xl focus:border-red-primary focus:outline-none"
              />
            ))}
          </div>
          {error && (
            <p className="text-red-primary font-semibold mt-2">{error}</p>
          )}
          <motion.button
            className="mt-5 w-full py-4 px-4 bg-red-primary text-white font-bold rounded-full
                    shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2
                     focus:ring-red-primary focus:ring-offset-2 focus:ring-offset-white transition duration-200 focus:shadow-2xl"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={cargando || code.some((digit) => !digit)}
          >
            {cargando ? "Verificando..." : "Verificar Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default EmailVerificacion;
