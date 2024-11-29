import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Creamos el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Verificar el token al cargar el componente
  useEffect(() => {
    if (token) {
      axios
        .get('https://bibliolights-backend.onrender.com/api/auth/validate', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setUser(response.data.user))
        .catch((error) => {
          console.error('Token inválido', error);
          logout(); // Si el token no es válido, hacer logout automáticamente
        });
    }
  }, [token]);

  // Función para iniciar sesión
  const login = (token) => {
    localStorage.setItem('token', token); // Guardamos el token en el localStorage
    setToken(token); // Actualizamos el estado del token
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token'); // Eliminamos el token del localStorage
    setToken(null); // Limpiamos el estado del token
    setUser(null); // Limpiamos la información del usuario
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
