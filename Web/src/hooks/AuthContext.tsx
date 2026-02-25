import { useEffect, useState } from "react";
import api from "@api/api";
import { AuthContext } from "./auth";

function sanitizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .trim();
}

function normalizeRole(value) {
  return value === "admin" ? "admin" : "user";
}

function normalizeSafeUser(userLike) {
  if (!userLike || typeof userLike !== "object") {
    return null;
  }

  const rawId = userLike.id;
  if (rawId === null || rawId === undefined) {
    return null;
  }

  return {
    id: rawId,
    name: sanitizeText(userLike.name ?? userLike.fullName ?? ""),
    email: sanitizeText(userLike.email ?? ""),
    role: normalizeRole(userLike.role),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión desde localStorage al iniciar
  useEffect(() => {
    const raw = localStorage.getItem("auth:user");
    if (raw) {
      try {
        setUser(normalizeSafeUser(JSON.parse(raw)));
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

    const safeUser = normalizeSafeUser({
      id,
      fullName,
      email: userEmail,
      role: admin ? "admin" : "user",
    });
    setUser(safeUser);
    return { id: safeUser.id, name: safeUser.name, role: safeUser.role };
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
