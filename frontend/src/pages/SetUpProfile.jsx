import { react, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";

function SetUpProfile() {
  return (
    <div className="bg-red-primary w-screen h-screen relative flex items-center justify-center p-6 gap-6">
      <div className="bg-white w-full md:w-1/2 lg:w-2/3 xl:w-3/4 h-full rounded-xl justify-center flex items-center">

        <h2>Primero saber quien chingados es.</h2>



      </div>
      <div className="bg-white w-full md:w-1/2 lg:w-1/3 xl:w-1/4 h-full rounded-xl justify-center flex items-center">
      </div>
    </div>
  );
}

export default SetUpProfile;
