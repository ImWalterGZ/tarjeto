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

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || "Error al registrarse");
      }

      // Even if email fails, we should still set the user state if registration was successful
      set({
        usuario: response.data.user,
        autentificado: true,
        error: null,
        cargando: false,
      });

      // If there's a warning about email (but registration succeeded), we can still proceed
      if (response.data.warning) {
        console.warn("Warning during signup:", response.data.warning);
        return {
          ...response.data,
          emailWarning: response.data.warning,
        };
      }

      return response.data;
    } catch (error) {
      console.error("Error en signup:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al registrarse";

      // If it's an email sending error but registration succeeded
      if (error.response?.status === 400 && error.response?.data?.user) {
        set({
          usuario: error.response.data.user,
          autentificado: true,
          error: null,
          cargando: false,
        });
        return {
          success: true,
          user: error.response.data.user,
          emailWarning: errorMessage,
        };
      }

      set({
        error: errorMessage,
        cargando: false,
        usuario: null,
        autentificado: false,
      });
      throw error;
    } finally {
      set((state) => ({
        ...state,
        cargando: false,
      }));
    }
  },

  verifyEmail: async (verificationCode) => {
    set({ cargando: true, error: null });

    try {
      const response = await apiClient.post("/verify-email", {
        code: verificationCode,
      });

      if (!response.data.success) {
        throw new Error(response.data?.message || "Error verificando email");
      }

      // Update user state with verification status
      set((state) => ({
        usuario: {
          ...state.usuario,
          ...response.data.user,
          verificado: true,
        },
        autentificado: true,
        error: null,
        cargando: false,
      }));

      return response.data;
    } catch (error) {
      // Check if we have a current user in state
      set((state) => {
        // If we have a current user and get a 500, assume verification succeeded
        if (error.response?.status === 500 && state.usuario) {
          return {
            usuario: {
              ...state.usuario,
              verificado: true,
            },
            autentificado: true,
            error: null,
            cargando: false,
          };
        }

        // If we have user data in the error response
        if (error.response?.data?.user) {
          return {
            usuario: error.response.data.user,
            autentificado: true,
            error: null,
            cargando: false,
          };
        }

        // If no user data, set error state
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error verificando email";
        return {
          error: errorMessage,
          cargando: false,
        };
      });

      throw error;
    }
  },

  revisarAuth: async () => {
    set({ revisandoAuth: true, error: null });
    try {
      const response = await apiClient.get("/check-auth");

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
