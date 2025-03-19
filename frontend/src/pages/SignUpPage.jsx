import { motion, AnimatePresence } from "framer-motion";
import { Loader, Lock, Mail } from "lucide-react";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrength from "../components/PasswordStrength";
import Input from "../components/signUp/Input";
import useRecaptcha from "../components/signUp/useReCaptcha";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState();
  const { capchaToken, recaptchaRef, handleRecaptcha } = useRecaptcha();
  const [formErrors, setFormErrors] = useState({});
  const { signup, error, cargando } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Correo electrónico inválido";
    }

    if (!contrasena) {
      errors.contrasena = "La contraseña es requerida";
    } else if (contrasena.length < 6) {
      errors.contrasena = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!confirmarContrasena) {
      errors.confirmarContrasena = "La contraseña es requerida";
    } else if (confirmarContrasena !== contrasena) {
      errors.confirmarContrasena = "Las contraseñas no coinciden";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, completa todos los campos correctamente");
      return;
    }
    if (capchaToken && email && contrasena) {
      try {
        const response = await signup(email, contrasena, " ");

        if (response.data.recaptchaValid === false) {
          toast.error("ReCAPTCHA fallido, vuelve a intentar", {
            duration: 6000,
          });
          handleRecaptcha("");
          if (recaptchaRef.current) {
            recaptchaRef.current.reset();
          }
          return;
        }
        recaptchaRef.current?.reset();

        if (response.emailWarning) {
          // Registration successful but email had issues
          toast.error("Nota: " + response.emailWarning, {
            duration: 6000,
          });
        } else {
          toast.success("¡Registro exitoso! Verifica tu correo electrónico.");
        }

        // Navigate to verify-email in both cases
        navigate("/verify-email");
      } catch (error) {
        console.error("Error en registro:", error);
        toast.error(error.response?.data?.message || "Error al registrarse");
      }
    }
  };

  return (
    <motion.div
      className="bg-red-primary w-screen h-screen p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="bg-white w-full h-full rounded-xl justify-center flex items-center"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key="form-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="max-w-lg w-full rounded-2xl p-4 bg-[#F2F2F2] overflow-hidden"
            >
              <motion.div
                className="px-14 py-8 bg-white rounded-t-2xl"
                layout="position"
                layoutId="form-content"
                transition={{
                  layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                  height: { duration: 0.4 },
                }}
              >
                <motion.h2
                  className="text-2xl font-bold mb-6 text-center bg-red-primary text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Hazte notar, aquí es donde empieza lo bueno
                </motion.h2>

                <form onSubmit={handleSignUp} noValidate>
                  <motion.div className="space-y-4" layout="position">
                    <motion.div
                      layout="position"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <Input
                        icon={Mail}
                        type="email"
                        placeholder="Ingresa tu correo electrónico"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setFormErrors({ ...formErrors, email: "" });
                        }}
                      />
                      <AnimatePresence mode="wait">
                        {formErrors.email && (
                          <motion.p
                            className="text-red-500 text-sm mt-1"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {formErrors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div
                      layout="position"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      <Input
                        icon={Lock}
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={contrasena}
                        onChange={(e) => {
                          setContrasena(e.target.value);
                          setFormErrors({ ...formErrors, contrasena: "" });
                        }}
                      />
                      <AnimatePresence mode="wait">
                        {formErrors.contrasena && (
                          <motion.p
                            className="text-red-500 text-sm mt-1"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {formErrors.contrasena}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <AnimatePresence mode="wait">
                      {contrasena.length >= 6 && (
                        <motion.div
                          layout="position"
                          initial={{ opacity: 0, height: 0, y: -20 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -20 }}
                          transition={{
                            duration: 0.4,
                            height: { duration: 0.3 },
                          }}
                        >
                          <Input
                            icon={Lock}
                            type="password"
                            placeholder="Confirma tu contraseña"
                            value={confirmarContrasena}
                            onChange={(e) => {
                              setConfirmarContrasena(e.target.value);
                              setFormErrors({
                                ...formErrors,
                                confirmarContrasena: "",
                              });
                            }}
                          />
                          <AnimatePresence mode="wait">
                            {formErrors.confirmarContrasena && (
                              <motion.p
                                className="text-red-500 text-sm mt-1"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {formErrors.confirmarContrasena}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      layout="position"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <PasswordStrength contrasena={contrasena} />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="mt-5 w-full flex justify-center items-center"
                    layout="position"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  >
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6LdjBPkqAAAAABP-oR5fE1RXdmsZygeZmeuQpm-T"
                      onChange={handleRecaptcha}
                    />
                  </motion.div>

                  <motion.button
                    className="mt-5 w-full py-4 px-4 bg-red-primary text-white font-bold rounded-full
                    shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2
                    focus:ring-red-primary focus:ring-offset-2 focus:ring-offset-white 
                    transition duration-200 focus:shadow-2xl disabled:opacity-50 
                    disabled:cursor-not-allowed"
                    whileHover={{
                      scale: cargando ? 1 : 1.02,
                      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                    }}
                    whileTap={{
                      scale: cargando ? 1 : 0.98,
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.8,
                      type: "spring",
                      stiffness: 200,
                    }}
                    type="submit"
                    disabled={cargando}
                  >
                    {cargando ? (
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Loader className="mx-auto h-6 w-6" />
                      </motion.div>
                    ) : (
                      "Registrarte"
                    )}
                  </motion.button>
                </form>
              </motion.div>

              <motion.div
                className="px-8 py-4 bg-white rounded-b-lg flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.9 }}
              >
                <p className="text-sm text-gray-500">
                  ¿Ya tienes una cuenta?{" "}
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/login"
                      className="text-red-primary hover:underline"
                    >
                      Inicia sesión :)
                    </Link>
                  </motion.span>
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignUpPage;
