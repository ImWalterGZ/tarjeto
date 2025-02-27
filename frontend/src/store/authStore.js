// En este archivo vamos a almacenar todos los estados y funciones necesarias para la autentificacion
// A este archivo se llama de otras funciones
// Axios nos va a ayudar para crear apis
import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5050/api/auth";

//En cada peticion, axios pondra las cookies en el header
axios.defaults.withCredentials = true;

// Configurar interceptores de Axios
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la petición:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const useAuthStore = create((set) => ({
  usuario: null,
  autentificado: false,
  error: null,
  cargando: false,
  revisandoAuth: true,

  login: async (email, contrasena) => {
    set({ cargando: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        contrasena,
        
      });
      
      console.log("Respuesta de login:", response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Error al iniciar sesión");
      }

      set({
        usuario: response.data.user,
        tipoUsuario: response.data.user.tipoUsuario,
        autentificado: true,
        cargando: false,
      });
      return response.data;
    } catch (error) {
      console.error("Error en login:", error);
      set({
        error: error.response?.data?.message || error.message || "Error al iniciar sesión",
        tipoUsuario: null,
        cargando: false,
        autentificado: false,
        usuario: null
      });
      throw error;
    }
  },

  signup: async (email, contrasena, nombre) => {
    set({ cargando: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        contrasena,
        nombre,
      });
      set({
        usuario: response.data.usuario,
        autentificado: true,
        cargando: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error iniciando sesion",
        cargando: false,
      });
      throw error;
    }
  },

  verifyEmail: async (verificationCode) => {
    set({ cargando: true, error: null });
    try {
      console.log("Enviando código de verificación:", verificationCode);
      const response = await axios.post(`${API_URL}/verify-email`, {
        code: verificationCode,
      });
      console.log("Respuesta completa de verifyEmail:", response.data);
      
      set({
        usuario: response.data.user,
        autentificado: true,
        cargando: false,
      });
      console.log("Estado actualizado después de verifyEmail:", {
        usuario: response.data.user,
        autentificado: true
      });
      return response.data;
    } catch (error) {
      console.error("Error response:", error.response);
      set({
        error: error.response?.data?.message || "Error verificando email",
        cargando: false,
      });
      throw error;
    }
  },

  revisarAuth: async () => {
    set({ revisandoAuth: true, error: null });
    try {
      console.log("Iniciando revisión de autenticación");
      const response = await axios.get(`${API_URL}/check-auth`);
      console.log("Respuesta de check-auth:", response.data);
      
      if (response.data.usuario) {
        console.log("Usuario encontrado en check-auth:", response.data.usuario);
        set({
          usuario: response.data.usuario,
          autentificado: true,
          revisandoAuth: false,
        });
        console.log("Estado actualizado después de check-auth:", {
          usuario: response.data.usuario,
          autentificado: true
        });
      } else {
        console.log("No se encontró usuario en check-auth");
        set({ 
          usuario: null,
          autentificado: false,
          revisandoAuth: false,
          error: "No se encontró información del usuario"
        });
      }
    } catch (error) {
      console.error("Error al revisar autenticación:", error.response?.data || error.message);
      set({ 
        usuario: null,
        error: error.response?.data?.message || "Error al verificar la autenticación",
        revisandoAuth: false,
        autentificado: false 
      });
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        usuario: null,
        autentificado: false,
        error: null,
        revisandoAuth: false
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }
}));
