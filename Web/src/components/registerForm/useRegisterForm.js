import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function useRegisterForm(editingUser, onSuccess) {
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    email: "",
    passwordHash: "",
  });

  const [errors, setErrors] = useState({});
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

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

  const handleCreate = async (e) => {
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
      onSuccess();
      setForm({ fullName: "", dateOfBirth: "", email: "", passwordHash: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creando usuario");
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
      await api.put(`/users/${editingUser.id}`, form);
      alert("Usuario actualizado");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error actualizando usuario");
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
