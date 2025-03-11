import React from "react";

const Select = React.forwardRef(
  ({ label, options = [], error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
          block w-full rounded-md border-gray-300 shadow-sm
          focus:border-red-500 focus:ring-red-500 sm:text-sm
          ${error ? "border-red-300" : "border-gray-300"}
          ${className}
        `}
          {...props}
        >
          <option value="">Seleccionar...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
