// En este archivo vamos a almacenar todos los estados y funciones necesarias para la autentificacion
// A este archivo se llama de otras funciones
import { create } from "zustand";
import apiClient from "../config/axios";

export const useAuthStore = create((set) => ({
  usuario: null,
  autentificado: false,
  error: null,
  cargando: false,
  revisandoAuth: true,

  login: async (email, contrasena) => {
    set({ cargando: true, error: null });
    try {
      const response = await apiClient.post("/login", {
        email,
        contrasena,
      });

      console.log("Respuesta de login:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Error al iniciar sesión");
      }

      set({
        usuario: response.data.user,
        autentificado: true,
        cargando: false,
      });
      return response.data;
    } catch (error) {
      console.error("Error en login:", error);
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Error al iniciar sesión",
        cargando: false,
        autentificado: false,
        usuario: null,
      });
      throw error;
    }
  },

  signup: async (email, contrasena, nombre) => {
    set({ cargando: true, error: null });
    try {
      const response = await apiClient.post("/signup", {
        email,
        contrasena,
        nombre,
      });
      set({
        usuario: response.data.user,
        autentificado: true,
        cargando: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error al registrarse",
        cargando: false,
      });
      throw error;
    }
  },

  verifyEmail: async (verificationCode) => {
    set({ cargando: true, error: null });
    try {
      console.log("Enviando código de verificación:", verificationCode);
      const response = await apiClient.post("/verify-email", {
        code: verificationCode,
      });
      console.log("Respuesta completa de verifyEmail:", response.data);

      if (response.data.success) {
        set({
          usuario: response.data.user,
          autentificado: true,
          cargando: false,
        });
        return response.data;
      }
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
      const response = await apiClient.get("/check-auth");
      console.log("Respuesta de check-auth:", response.data);

      if (response.data.usuario) {
        set({
          usuario: response.data.usuario,
          autentificado: true,
          revisandoAuth: false,
        });
      } else {
        set({
          usuario: null,
          autentificado: false,
          revisandoAuth: false,
        });
      }
    } catch (error) {
      console.error(
        "Error al revisar autenticación:",
        error.response?.data || error.message
      );
      set({
        usuario: null,
        error:
          error.response?.data?.message ||
          "Error al verificar la autenticación",
        revisandoAuth: false,
        autentificado: false,
      });
    }
  },

  logout: async () => {
    try {
      await apiClient.post("/logout");
      set({
        usuario: null,
        autentificado: false,
        error: null,
        revisandoAuth: false,
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Even if the server call fails, we clear the local state
      set({
        usuario: null,
        autentificado: false,
        error: null,
        revisandoAuth: false,
      });
    }
  },
}));
