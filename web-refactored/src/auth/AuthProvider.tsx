import { isAxiosError } from "axios";
import { useEffect, useState, type ReactNode } from "react";

import api from "../api/api";
import { AuthContext, type AuthContextValue, type AuthRole, type AuthUser } from "./auth";

type AuthApiLoginResponse = {
  token?: string;
  user?: UserLike;
};

type UserLike = Record<string, unknown>;

function sanitizeText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .trim();
}

function normalizeRole(value: unknown): AuthRole {
  return value === "admin" ? "admin" : "user";
}

function normalizeSafeUser(userLike: UserLike | null): AuthUser | null {
  if (!userLike || typeof userLike !== "object") {
    return null;
  }

  const rawId = userLike.id;
  if (typeof rawId !== "string" && typeof rawId !== "number") {
    return null;
  }

  return {
    id: rawId,
    name: sanitizeText(userLike.name ?? userLike.fullName ?? ""),
    email: sanitizeText(userLike.email ?? ""),
    role: userLike.admin === true ? "admin" : normalizeRole(userLike.role),
  };
}

function getLoginErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || "Usuario o contrasena incorrectos";
  }

  return "Usuario o contrasena incorrectos";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawUser = localStorage.getItem("auth:user");
    const storedToken = localStorage.getItem("auth:token");

    if (rawUser && storedToken) {
      try {
        const safeUser = normalizeSafeUser(JSON.parse(rawUser));
        setUser(safeUser);
        setToken(safeUser ? storedToken : null);
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem("auth:user");
        localStorage.removeItem("auth:token");
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("auth:user", JSON.stringify(user));
      localStorage.setItem("auth:token", token);
      return;
    }

    localStorage.removeItem("auth:user");
    localStorage.removeItem("auth:token");
  }, [token, user]);

  async function login(email: string, password: string) {
    try {
      const { data } = await api.post<AuthApiLoginResponse>("/users/login", { email, password });
      const safeUser = normalizeSafeUser(data.user ?? null);

      if (!data.token || !safeUser) {
        throw new Error("Respuesta de autenticacion invalida");
      }

      localStorage.setItem("auth:user", JSON.stringify(safeUser));
      localStorage.setItem("auth:token", data.token);
      setUser(safeUser);
      setToken(data.token);
      return { id: safeUser.id, name: safeUser.name, role: safeUser.role };
    } catch (error) {
      throw new Error(getLoginErrorMessage(error));
    }
  }

  function logout() {
    localStorage.removeItem("auth:user");
    localStorage.removeItem("auth:token");
    setUser(null);
    setToken(null);
  }

  const value: AuthContextValue = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
