import React from "react";

const AccesoItem = ({ title, description, icon: Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full h-full bg-white rounded-lg hover:bg-red-50 hover:border-red-200 duration-150 transition-all shadow-sm border border-gray-200 p-4"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="w-12 h-12 flex items-center justify-center">
          <Icon className="w-8 h-8 text-red-600" />
        </div>
        <div className="text-center">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default AccesoItem;
