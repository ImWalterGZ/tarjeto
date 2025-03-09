import { User, Lock, Mail, Loader } from "lucide-react";
import Input from "../components/signUp/Input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PasswordStrength from "../components/PasswordStrength";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [nombre, setNombre] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const { signup, error, cargando } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!nombre.trim()) {
      errors.nombre = "El nombre es requerido";
    }

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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, completa todos los campos correctamente");
      return;
    }

    try {
      const response = await signup(email, contrasena, nombre);
      toast.success("¡Registro exitoso! Verifica tu correo electrónico.");
      navigate("/verify-email");
    } catch (error) {
      console.error("Error en registro:", error);
      toast.error(error.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div className="bg-red-primary w-screen h-screen p-5">
      <div className="bg-white w-full h-full rounded-xl justify-center flex items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full rounded-2xl p-4 bg-[#F2F2F2] overflow-hidden"
          >
            <div className="px-14 py-8 bg-white rounded-t-2xl">
              <h2 className="text-2xl font-bold mb-6 text-center bg-red-primary text-transparent bg-clip-text">
                Hazte notar, aquí es donde empieza lo bueno
              </h2>
              <form onSubmit={handleSignUp} noValidate>
                <div className="space-y-4">
                  <div>
                    <Input
                      icon={User}
                      type="text"
                      placeholder="Ingresa tu nombre"
                      value={nombre}
                      onChange={(e) => {
                        setNombre(e.target.value);
                        setFormErrors({ ...formErrors, nombre: "" });
                      }}
                    />
                    {formErrors.nombre && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.nombre}
                      </p>
                    )}
                  </div>

                  <div>
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
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
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
                    {formErrors.contrasena && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.contrasena}
                      </p>
                    )}
                  </div>

                  <PasswordStrength contrasena={contrasena} />
                </div>

                <motion.button
                  className="mt-5 w-full py-4 px-4 bg-red-primary text-white font-bold rounded-full
                    shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2
                    focus:ring-red-primary focus:ring-offset-2 focus:ring-offset-white 
                    transition duration-200 focus:shadow-2xl disabled:opacity-50 
                    disabled:cursor-not-allowed"
                  whileHover={{ scale: cargando ? 1 : 1.06 }}
                  whileTap={{ scale: cargando ? 1 : 0.98 }}
                  type="submit"
                  disabled={cargando}
                >
                  {cargando ? (
                    <Loader className="animate-spin mx-auto h-6 w-6" />
                  ) : (
                    "Registrarte"
                  )}
                </motion.button>
              </form>
            </div>
            <div className="px-8 py-4 bg-white rounded-b-lg flex justify-center">
              <p className="text-sm text-gray-500">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="text-red-primary hover:underline">
                  Inicia sesión :)
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
