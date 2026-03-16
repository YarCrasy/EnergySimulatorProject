import { isAxiosError } from "axios";
import { useEffect, useState, type ChangeEvent } from "react";
import api from "../../api/api";
import type { EditableUser, RegisterFormErrors, RegisterFormState } from "@models/domain/register";

interface PreventableEvent {
  preventDefault?: () => void;
}

export default function useRegisterForm(
  editingUser?: EditableUser | null,
  onSuccess?: () => void
) {
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
        fullName: editingUser.fullName,
        dateOfBirth: editingUser.dateOfBirth,
        email: editingUser.email,
        passwordHash: "",
      });
    } else {
      setForm({ fullName: "", dateOfBirth: "", email: "", passwordHash: "" });
    }
    setErrors({});
  }, [editingUser]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  //validaciones para el formulario

  const validate = (): RegisterFormErrors => {
    const newErrors: RegisterFormErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Nombre obligatorio";
    else if (form.fullName.length < 3) newErrors.fullName = "Mínimo 3 caracteres";

    if (!form.dateOfBirth) newErrors.dateOfBirth = "Fecha de nacimiento obligatoria";
    else if (new Date(form.dateOfBirth) > new Date())
      newErrors.dateOfBirth = "Fecha no puede ser futura";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) newErrors.email = "Correo obligatorio";
    else if (!emailRegex.test(form.email)) newErrors.email = "Correo inválido";

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!form.passwordHash) newErrors.passwordHash = "Contraseña obligatoria";
    else if (!passwordRegex.test(form.passwordHash))
      newErrors.passwordHash =
        "8 caracteres, al menos 1 mayúscula, 1 minúscula y 1 número";

    return newErrors;
  };

  const handleCreate = async (e?: PreventableEvent) => {
    e?.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/users", form);
      alert("Usuario creado");
      onSuccess?.();
      setForm({ fullName: "", dateOfBirth: "", email: "", passwordHash: "" });
    } catch (err) {
      console.error(err);
      alert(
        isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message || "Error creando usuario"
          : "Error creando usuario"
      );
    } finally {
      setSubmitting(false);
   }
  };

  const handleUpdate = async () => {
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
    } catch (err) {
      console.error(err);
      alert(
        isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message || "Error actualizando usuario"
          : "Error actualizando usuario"
      );
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
    setErrors,
  };
}
