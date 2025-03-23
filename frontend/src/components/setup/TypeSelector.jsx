import { motion } from "framer-motion";
import logo from "/images/isotipo-red.png";

function TypeSelector({ userType, setUserType, handleStartSetup }) {
  return (
    <motion.div
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center h-full p-8"
    >
      <img src={logo} alt="Tarjeto" className="h-8 mb-8" />
      <div className="flex flex-col gap-4 w-full max-w-md">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setUserType("user")}
          className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all
            ${
              userType === "user"
                ? "border-red-500 bg-red-50"
                : "border-gray-200 hover:border-red-200 hover:bg-red-50"
            }`}
        >
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-gray-900">Soy un cliente</p>
            <p className="text-sm text-gray-500">
              Quiero acumular puntos y recibir recompensas
            </p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setUserType("business")}
          className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all
            ${
              userType === "business"
                ? "border-red-500 bg-red-50"
                : "border-gray-200 hover:border-red-200 hover:bg-red-50"
            }`}
        >
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 21H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 7H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 7V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 7V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 4L4 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 4L20 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-gray-900">Soy un negocio</p>
            <p className="text-sm text-gray-500">
              Quiero fidelizar clientes y crear recompensas
            </p>
          </div>
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleStartSetup}
        className="btn btn-primary w-6/12 mt-8"
        disabled={!userType}
        data-theme="light"
        style={{ boxShadow: "none", color: "#FFFFFF" }}
      >
        Siguiente
      </motion.button>
    </motion.div>
  );
}

export default TypeSelector;
