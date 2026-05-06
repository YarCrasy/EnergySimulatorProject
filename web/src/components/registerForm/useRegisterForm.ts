import { isAxiosError } from "axios";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import api from "../../api/api";
import type { EditableUser, RegisterFormErrors, RegisterFormState } from "./types";

type PreventableEvent = FormEvent<HTMLFormElement> | FormEvent<HTMLButtonElement>;

export default function useRegisterForm(editingUser?: EditableUser | null, onSuccess?: () => void) {
  const [form, setForm] = useState<RegisterFormState>({
    fullName: "",
    dateOfBirth: "",
    email: "",
    passwordHash: "",
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setForm({
        fullName: editingUser.fullName ?? "",
        dateOfBirth: editingUser.dateOfBirth ?? "",
        email: editingUser.email ?? "",
        passwordHash: "",
      });
    } else {
      setForm({ fullName: "", dateOfBirth: "", email: "", passwordHash: "" });
    }
    setErrors({});
  }, [editingUser]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((currentForm) => ({ ...currentForm, [event.target.name]: event.target.value }));
    setErrors((currentErrors) => ({ ...currentErrors, [event.target.name]: "" }));
  };

  const validate = (): RegisterFormErrors => {
    const newErrors: RegisterFormErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Nombre obligatorio";
    else if (form.fullName.length < 3) newErrors.fullName = "Minimo 3 caracteres";

    if (!form.dateOfBirth) newErrors.dateOfBirth = "Fecha de nacimiento obligatoria";
    else if (new Date(form.dateOfBirth) > new Date()) newErrors.dateOfBirth = "Fecha no puede ser futura";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) newErrors.email = "Correo obligatorio";
    else if (!emailRegex.test(form.email)) newErrors.email = "Correo invalido";

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!form.passwordHash) newErrors.passwordHash = "Contrasena obligatoria";
    else if (!passwordRegex.test(form.passwordHash)) {
      newErrors.passwordHash = "8 caracteres, al menos 1 mayuscula, 1 minuscula y 1 numero";
    }

    return newErrors;
  };

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (!isAxiosError<{ message?: string }>(error)) return fallback;
    return error.response?.data?.message || fallback;
  };

  const handleCreate = async (event?: PreventableEvent): Promise<boolean> => {
    event?.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return false;
    }

    setSubmitting(true);
    try {
      await api.post("/users", form);
      alert("Usuario creado");
      onSuccess?.();
      setForm({ fullName: "", dateOfBirth: "", email: "", passwordHash: "" });
      return true;
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Error creando usuario"));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (event?: PreventableEvent) => {
    event?.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await api.put(`/users/${editingUser?.id}`, form);
      alert("Usuario actualizado");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Error actualizando usuario"));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    errors,
    submitting,
    handleChange,
    handleCreate,
    handleUpdate,
  };
}
