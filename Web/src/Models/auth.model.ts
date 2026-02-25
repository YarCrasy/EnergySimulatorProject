import type { AuthUser, LoginCredentials } from "./user.model";

export interface AuthContextModel {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Pick<AuthUser, "id" | "name" | "role">>;
  logout: () => void;
}

export type LoginFormModel = LoginCredentials;
