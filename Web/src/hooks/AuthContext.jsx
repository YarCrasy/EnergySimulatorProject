import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión desde localStorage al iniciar
  useEffect(() => {
    const raw = localStorage.getItem("auth:user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Guardar sesión cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem("auth:user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth:user");
    }
  }, [user]);

 // login real con llamada a backend
 async function login(email, password) {
  try {
    const res = await api.post("/users/login", { email, password });
    const { id, fullName, email: userEmail, admin } = res.data;

    const role = admin ? "admin" : "user";
    setUser({ id, name: fullName, email: userEmail, role });
    return { id, name: fullName, role };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Usuario o contraseña incorrectos");
  }
}


  // Logout
  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook para acceder al contexto fácilmente
export function useAuth() {
  return useContext(AuthContext);
}
