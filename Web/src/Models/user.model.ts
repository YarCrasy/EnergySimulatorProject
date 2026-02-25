import type { EntityId } from "./common.model";

export type UserRole = "admin" | "user";

export interface UserModel {
  id: EntityId;
  fullName?: string;
  name?: string;
  email: string;
  role?: UserRole;
  dateOfBirth?: string;
}

export interface RegisterUserPayload {
  fullName: string;
  dateOfBirth: string;
  email: string;
  passwordHash: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface BackendLoginResponse {
  id: EntityId;
  fullName: string;
  email: string;
  admin?: boolean;
}

export interface AuthUser {
  id: EntityId;
  name: string;
  email: string;
  role: UserRole;
}

export function sanitizeText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export function normalizeRole(value: unknown): UserRole {
  return value === "admin" ? "admin" : "user";
}

export function normalizeSafeUser(userLike: Partial<UserModel> | null | undefined): AuthUser | null {
  if (!userLike || typeof userLike !== "object") {
    return null;
  }

  if (userLike.id == null) {
    return null;
  }

  return {
    id: userLike.id,
    name: sanitizeText(userLike.name ?? userLike.fullName ?? ""),
    email: sanitizeText(userLike.email ?? ""),
    role: normalizeRole(userLike.role),
  };
}

export function mapBackendLoginResponse(data?: BackendLoginResponse | null) {
  if (!data) {
    return null;
  }

  return normalizeSafeUser({
    id: data.id,
    fullName: data.fullName,
    email: data.email,
    role: data.admin ? "admin" : "user",
  });
}
