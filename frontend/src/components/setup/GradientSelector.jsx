import { motion } from "framer-motion";
import { gradients } from "../../components/profile/BusinessPreview";

function GradientSelector({ value, onChange }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Personaliza el estilo de tu tarjeta
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(gradients).map(([name, gradient]) => (
          <motion.button
            key={name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(name, "gradient")}
            className={`relative h-24 rounded-xl overflow-hidden border-2 transition-all ${
              value === name ? "border-red-500" : "border-transparent"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
            <div className="relative h-full w-full flex items-center justify-center">
              <span className="text-white font-medium capitalize">{name}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default GradientSelector;
