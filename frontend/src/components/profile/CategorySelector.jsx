import React from "react";
import { motion } from "framer-motion";
import {
  Coffee,
  Pizza,
  Fish,
  Sandwich,
  Cake,
  UtensilsCrossed,
  Soup,
  Beef,
  Cookie,
  Salad,
  ChefHat,
  Shell,
} from "lucide-react";

const categories = [
  { id: "comida-rapida", name: "Comida rápida", icon: Sandwich },
  { id: "taqueria", name: "Taquería", icon: ChefHat },
  { id: "mariscos", name: "Mariscos", icon: Fish },
  { id: "cafeteria", name: "Cafetería", icon: Coffee },
  { id: "panaderia", name: "Panadería", icon: Cookie },
  { id: "reposteria", name: "Repostería", icon: Cake },
  { id: "comida-mexicana", name: "Comida mexicana", icon: UtensilsCrossed },
  { id: "pizzeria", name: "Pizzería", icon: Pizza },
  { id: "buffet", name: "Buffet", icon: Beef },
  { id: "comida-saludable", name: "Comida saludable", icon: Salad },
  { id: "comida-china", name: "Comida china", icon: Soup },
  { id: "sushi", name: "Sushi", icon: Shell },
];

const CategorySelector = ({
  selectedCategories = [],
  onChange,
  maxSelections = 3,
}) => {
  const handleToggle = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter((id) => id !== categoryId));
    } else if (selectedCategories.length < maxSelections) {
      onChange([...selectedCategories, categoryId]);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="w-full">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
      >
        {categories.map((category, index) => {
          const Icon = category.icon;
          const isSelected = selectedCategories.includes(category.id);

          return (
            <motion.button
              variants={item}
              key={category.id}
              onClick={() => handleToggle(category.id)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl
                transition-all duration-200 gap-2
                ${
                  isSelected
                    ? "bg-red-50 border-2 border-red-500 text-red-500"
                    : "bg-white border-2 border-gray-100 text-gray-600 hover:border-red-200 hover:bg-red-50"
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon
                className={`w-8 h-8 ${
                  isSelected ? "text-red-500" : "text-gray-400"
                }`}
              />
              <span className="text-sm font-medium text-center">
                {category.name}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {maxSelections > 0 && (
        <p className="text-sm text-gray-500 mt-3">
          Selecciona hasta {maxSelections} categorías (
          {selectedCategories.length}/{maxSelections})
        </p>
      )}
    </div>
  );
};

export default CategorySelector;
