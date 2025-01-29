// En este archivo vamos a almacenar todos los estados y funciones necesarias para la autentificacion
// A este archivo se llama de otras funciones
// Axios nos va a ayudar para crear apis
import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5050/api/auth";

//En cada peticion, axios pondra las cookies en el header
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  usuario: null,
  autentificado: false,
  error: null,
  cargando: false,
  revisandoAuth: true,
  signup: async (email, contrasena, nombre) => {
    set({ cargando: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        contrasena,
        nombre,
      });
      set({
        usuario: response.data.usario,
        autentificado: true,
        cargando: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error iniciando sesion",
        cargando: false,
      });
      throw error;
    }
  },

  verifyEmail: async (verificationCode) => {
    set({ cargando: true, error: null });
    try {
      console.log("Sending verification code:", verificationCode);
      const response = await axios.post(`${API_URL}/verify-email`, {
        code: verificationCode, // Update the field name to 'code'
      });
      console.log("Response:", response.data);
      set({
        usuario: response.data.usuario,
        autentificado: true,
        cargando: false,
      });
      return response.data;
    } catch (error) {
      console.error("Error response:", error.response);
      set({
        error: error.response.data.message || "Error verificando email",
        cargando: false,
      });
      throw error;
    }
  },

  revisarAuth: async () => {
    set({ revisandoAuth: true, error: null });
    try {
      const responde = await axios.get(`${API_URL}/check-auth`);
      set({
        usuario: response.data.usario,
        autentificado: true,
        revisandoAuth: false,
      });
    } catch (error) {
      set({ error: null, revisandoAuth: false, autentificado: false });
    }
  },
}));
