import { isAxiosError } from "axios";
import { useEffect, useState, type ReactNode } from "react";
import api from "@api/api";
import type { AuthApiLoginResponse } from "@models/dto/auth";
import type { AuthRole, AuthUser } from "@models/domain/auth";
import { AuthContext } from "./auth";

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
    role: normalizeRole(userLike.role),
  };
}

function getLoginErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || "Usuario o contraseña incorrectos";
  }

  if (typeof error === "object" && error !== null && "response" in error) {
    const message = (error as { response?: { data?: { message?: unknown } } }).response?.data?.message;

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  return "Usuario o contraseña incorrectos";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
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

  async function login(email: string, password: string) {
    try {
      const res = await api.post<AuthApiLoginResponse>("/users/login", { email, password });
      const { id, fullName, email: userEmail, admin } = res.data;

      const safeUser = normalizeSafeUser({
        id,
        fullName,
        email: userEmail,
        role: admin ? "admin" : "user",
      });

      if (!safeUser) {
        throw new Error("Respuesta de autenticacion invalida");
      }

      setUser(safeUser);
      return { id: safeUser.id, name: safeUser.name, role: safeUser.role };
    } catch (error) {
      throw new Error(getLoginErrorMessage(error));
    }
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
