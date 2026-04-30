import api from "./api";
import type { Identifier, LooseRecord } from "../models/common";

export interface UserProfile extends LooseRecord {
  id?: Identifier | null;
  name?: string;
  fullName?: string;
  email?: string;
  role?: string;
  admin?: boolean;
  dateOfBirth?: string;
}

export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const { data } = await api.get<UserProfile[]>("/users");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error solicitando usuarios", error);
    return [];
  }
}

export async function getUserById(id: Identifier): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>(`/users/${id}`);
  return data;
}
