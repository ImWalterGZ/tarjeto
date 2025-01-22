// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay una sesión activa al cargar la app
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      // Aquí irá tu llamada a la API real
      // Por ahora simulamos una respuesta
      const response = await mockLogin(credentials);

      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirigir según el tipo de usuario
      if (response.user.type === "business") {
        navigate("/negocio");
      } else {
        navigate("/cliente");
      }
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

// Función temporal para simular login
const mockLogin = async (credentials) => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (credentials.email && credentials.password) {
    return {
      user: {
        id: "123",
        name: "Usuario Ejemplo",
        email: credentials.email,
        type: credentials.userType, // 'business' o 'client'
      },
    };
  }
  throw new Error("Credenciales inválidas");
};
