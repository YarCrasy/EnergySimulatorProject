import type { Identifier } from "../common";

export interface AuthApiLoginResponse {
  id: Identifier;
  fullName?: string;
  email?: string;
  admin?: boolean;
}
