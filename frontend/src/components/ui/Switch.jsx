import React from "react";

const Switch = React.forwardRef(
  (
    { label, checked = false, onCheckedChange, className = "", ...props },
    ref
  ) => {
    return (
      <label className="inline-flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            ref={ref}
            {...props}
          />
          <div
            className={`
          block w-14 h-8 rounded-full 
          ${checked ? "bg-red-600" : "bg-gray-300"}
          transition-colors duration-150
          ${className}
        `}
          />
          <div
            className={`
          absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-150
          ${checked ? "transform translate-x-6" : ""}
        `}
          />
        </div>
        {label && (
          <span className="ml-3 text-sm font-medium text-gray-700">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
