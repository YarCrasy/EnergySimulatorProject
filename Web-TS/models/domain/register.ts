import type { Identifier } from "../common";

export interface RegisterFormState {
  fullName: string;
  dateOfBirth: string;
  email: string;
  passwordHash: string;
}

export interface EditableUser {
  id?: Identifier;
  fullName?: string;
  dateOfBirth?: string;
  email?: string;
}

export type RegisterFormErrors = Partial<Record<keyof RegisterFormState, string>>;
