import { motion } from "framer-motion";
import { Loader, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/signUp/Input";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
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
                ¡Bienvenido de vuelta!
              </h2>
              <form onSubmit={handleLogin}>
                <Input
                  icon={Mail}
                  type="text"
                  placeholder="Ingresa tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
                <div className="flex justify-center items-center mb-6 -mt-3">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-red-primary font-semibold opacity-70 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <motion.button
                  className="mt-5 w-full py-4 px-4 bg-red-primary text-white  font-bold rounded-full
                    shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2
                     focus:ring-red-primary focus:ring-offset-2 focus:ring-offset-white transition duration-200 focus:shadow-2xl"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  onClick={() => setLoading(!isLoading)}
                >
                  {isLoading ? (
                    <Loader className="size-6 animate-spin mx-auto " />
                  ) : (
                    "Ir a tarjeto"
                  )}
                </motion.button>
              </form>
            </div>
            <div className="px-8 py-4 bg-white rounded-b-lg flex justify-center">
              <p className="text-sm text-gray-500">
                ¿No tienes cuenta? {""}
                <Link to={"/signup"} className="text-red-primary opacity-80">
                  Crea una :)
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
