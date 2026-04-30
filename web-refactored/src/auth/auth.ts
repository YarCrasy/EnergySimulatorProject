import { createContext, useContext } from "react";

export type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthLoginResult>;
  logout: () => void;
};

export type AuthRole = "admin" | "user";

export type AuthUser = {
  id: string | number;
  name: string;
  email: string;
  role: AuthRole;
};

export type AuthLoginResult = {
  id: AuthUser["id"];
  name: string;
  role: AuthRole;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
