import React from "react";

const AccesoItem = ({ title, icon: Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className=" bg-white rounded-xl h-full w-full  hover:bg-red-50 hover:border-red-primary outline-0 hover:outline-2 hover:outline-red-primary  duration-150 transition-all shadow-lg hover:shadow-md shadow-neutral-200 hover:shadow-red-primary border  border-gray-200 p-2"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="w-12 h-12 flex items-center justify-center">
          <Icon className="w-10 h-10 bg-red-primary text-white rounded-full p-2" />
        </div>
        <div className="text-center">
          <h3 className="text-xs font-semibold text-red-primary">{title}</h3>
        </div>
      </div>
    </button>
  );
};

export default AccesoItem;
