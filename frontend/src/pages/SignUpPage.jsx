import { User, Lock, Mail, Loader } from "lucide-react";
import Input from "../components/signUp/Input";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PasswordStrength from "../components/PasswordStrength";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [nombre, setNombre] = useState("");
  const { signup, error, cargando } = useAuthStore();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(email, contrasena, nombre);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-red-primary w-screen h-screen  p-5">
      <div className="bg-white w-full h-full rounded-xl justify-center flex items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`max-w-lg w-full rounded-2xl p-4 bg-[#F2F2F2]  overflow-hidden`}
          >
            <div className="px-14 py-8 bg-white rounded-t-2xl">
              <h2 className="text-2xl font-bold mb-6  text-center bg-red-primary text-transparent bg-clip-text">
                Hazte notar, aquí es donde empieza lo bueno
              </h2>
              <form onSubmit={handleSignUp}>
                <Input
                  icon={User}
                  type="text"
                  placeholder="Ingresa tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                <Input
                  icon={Mail}
                  type="text"
                  placeholder="Ingresa tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  icon={Lock}
                  type="text"
                  placeholder="Ingresa tu contraseñas"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
                {error && (
                  <p className="text-red-primary font-semibold ">{error}</p>
                )}
                <PasswordStrength contrasena={contrasena} />
                <motion.button
                  className="mt-5 w-full py-5 px-4 bg-red-primary text-white  font-bold rounded-full
                shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2
                 focus:ring-red-primary focus:ring-offset-2 focus:ring-offset-white transition duration-200 focus:shadow-2xl"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={cargando}
                >
                  {cargando ? (
                    <Loader className="animate-spin mx-auto size24" />
                  ) : (
                    "Registrarte"
                  )}
                </motion.button>
              </form>
            </div>
            <div className="px-8 py-4 bg-white rounded-b-lg flex justify-center">
              <p className="text-sm text-gray-500">
                Ya tienes una cuenta? {""}
                <Link to={"/login"} className="text-red-primary opacity-80">
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
