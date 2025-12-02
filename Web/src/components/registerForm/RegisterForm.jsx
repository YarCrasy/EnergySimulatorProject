import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../hooks/AuthContext";
import "./registerform.css";

export default function RegisterForm({ editingUser, onSuccess, onCancel }) {
  const { user: currentUser, loading } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    email: "",
    passwordHash: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null; // Evita render mientras cargamos

  const isAdmin = currentUser?.role === "admin";

  // Cuando se selecciona un usuario para editar o limpiar el formulario
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

  // Validaciones
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

  return (
    <form
      className="register-form"
      onSubmit={!isAdmin ? handleCreate : (e) => e.preventDefault()}
    >
      <div className="form-field">
        <label>Nombre completo</label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          type="text"
          placeholder="Juan Perez"
        />
        {errors.fullName && <span className="error">{errors.fullName}</span>}
      </div>

      <div className="form-field">
        <label>Fecha nacimiento</label>
        <input
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          type="date"
        />
        {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
      </div>

      <div className="form-field">
        <label>Correo electrónico</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="ejemplo@gmail.com"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-field">
        <label>Contraseña</label>
        <input
          name="passwordHash"
          value={form.passwordHash}
          onChange={handleChange}
          type="password"
          placeholder="********"
        />
        {errors.passwordHash && <span className="error">{errors.passwordHash}</span>}
      </div>

      {/* BOTONES */}
      <div className="button-group">
        {!isAdmin && (
          <button type="submit" disabled={submitting}>
            {submitting ? "Creando..." : "Crear cuenta"}
          </button>
        )}

        {isAdmin && editingUser && (
          <>
            <button type="button" onClick={handleUpdate} disabled={submitting}>
              {submitting ? "Actualizando..." : "Actualizar"}
            </button>
            <button type="button" onClick={onCancel}>
              Cancelar
            </button>
          </>
        )}

        {isAdmin && !editingUser && (
          <button type="button" onClick={handleCreate} disabled={submitting}>
            {submitting ? "Creando..." : "Crear usuario"}
          </button>
        )}
      </div>
    </form>
  );
}
