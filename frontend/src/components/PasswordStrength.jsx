import { Check, Contact, X } from "lucide-react";
import React from "react";

const CritarioContrasena = ({ contrasena }) => {
  const criteria = [
    { label: "Al menos 6 letras", met: contrasena.length >= 6 },
    { label: "Al menos una mayuscula", met: /[A-Z]/.test(contrasena) },
    { label: "Al menos una minuscula", met: /[a-z]/.test(contrasena) },
    { label: "Contiene un numero", met: /\d/.test(contrasena) },
  ];
  return (
    <div className="mt-2 space-y-1">
      {criteria.map((item, index) => (
        <div key={item.label} className="flex items-center text-xs">
          {item.met ? (
            <Check className="size-4 text-green-500 mr-2" />
          ) : (
            <X className="size-4 text-red-primary mr-2" />
          )}
          <span className={item.met ? "text-green-500 " : " text-gray-500"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrength = ({ contrasena }) => {
  const getStrength = (contrasena) => {
    let strength = 0;
    if (contrasena.length >= 6) strength++;
    if (contrasena.match(/[a-z]/) && contrasena.match(/[A-Z]/)) strength++;
    if (contrasena.match(/\d/)) strength++;
    return strength;
  };

  const strength = getStrength(contrasena);

  const getStrengthText = (fuerza) => {
    if (fuerza === 0) return "Muy debil";
    if (fuerza === 1) return "Moderada";
    if (fuerza === 2) return "Fuerte";
    return "Muy fuerte";
  };

  const getColor = (fuerza) => {
    if (fuerza === 0) return "bg-red-400";
    if (fuerza === 1) return "bg-red-300";
    if (fuerza === 2) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Fuerza de contraseña</span>
        <span className="text-xs text-gray-400">
          {getStrengthText(strength)}
        </span>
      </div>
      <div className="flex space-x-1 ">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/3 rounded-full transition-colors duration-300 
                ${index < strength ? getColor(strength) : "bg-gray-600"}`}
          />
        ))}
      </div>
      <CritarioContrasena contrasena={contrasena} />
    </div>
  );
};

export default PasswordStrength;
