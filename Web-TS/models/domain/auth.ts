import type { Identifier } from "../common";

export type AuthRole = "admin" | "user";

export interface AuthUser {
  id: Identifier;
  name: string;
  email: string;
  role: AuthRole;
}

export interface AuthLoginResult {
  id: AuthUser["id"];
  name: string;
  role: AuthRole;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthLoginResult>;
  logout: () => void;
}
