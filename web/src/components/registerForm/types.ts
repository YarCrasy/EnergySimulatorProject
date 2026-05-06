export interface RegisterFormState {
  fullName: string;
  dateOfBirth: string;
  email: string;
  passwordHash: string;
}

export interface EditableUser {
  id?: string | number;
  fullName?: string;
  dateOfBirth?: string;
  email?: string;
}

export type RegisterFormErrors = Partial<Record<keyof RegisterFormState, string>>;
