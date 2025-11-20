import React, { createContext, useContext, useEffect, useState } from "react";
import { authLogin, authRegister } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Finaliza la carga inicial después de leer localStorage
    setLoading(false);

    if (!token) {
      // Limpieza si el token desaparece o es inválido
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await authLogin(email, password);
    if (!data.token) throw new Error("No se recibió token");

    // Adaptar respuesta del backend: separar token y datos del usuario
    const { token: receivedToken, ...userData } = data;

    // Persistencia en localStorage
    localStorage.setItem("token", receivedToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // Actualizar estado
    setToken(receivedToken);
    setUser(userData);

    // Estructura esperada por Login.js
    return { token: receivedToken, user: userData };
  };

  const register = (name, email, password) => {
    return authRegister(name, email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Propiedades derivadas para rutas protegidas
  const isAuthenticated = !!user && !!token;
  const isAdmin = user ? user.isAdmin : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        loading
      }}
    >
      {/* Renderiza los hijos solo cuando la inicialización ha terminado */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
