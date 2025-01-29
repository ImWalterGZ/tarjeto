import React from "react";

const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-6 h-14 ">
      <div className="absolute h-full inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-gray-500" />
      </div>
      <input
        {...props}
        className="w-full h-full pl-10 pr-3 py2 bg-[#F2F2F2] bg-opacity-50 rounded-2xl border-2 border-black border-opacity-50 
        focus:border-red-primary focus:ring-2 focus:ring-red-primary text-gray-600
         placeholder-gray-400 transition duration-200"
      />
    </div>
  );
};

export default Input;
