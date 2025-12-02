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

  // Evitar render mientras se carga el usuario
  if (loading) return null;

  const isAdmin = currentUser?.role === "admin";

  // === Cuando se selecciona un usuario para editar o limpiar el formulario ===
  useEffect(() => {
    if (editingUser) {
      setForm({
        fullName: editingUser.fullName,
        dateOfBirth: editingUser.dateOfBirth,
        email: editingUser.email,
        passwordHash: "", // opcional, solo para cambiar
      });
    } else {
      setForm({
        fullName: "",
        dateOfBirth: "",
        email: "",
        passwordHash: "",
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e?.preventDefault(); // Previene submit si se llama desde form
    try {
      await api.post("/users", form);
      alert("Usuario creado");
      onSuccess();
    } catch (err) {
      console.error("Error creando usuario:", err);
      alert("Error creando usuario");
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/users/${editingUser.id}`, form);
      alert("Usuario actualizado");
      onSuccess();
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      alert("Error actualizando usuario");
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
      </div>

      <div className="form-field">
        <label>Fecha nacimiento</label>
        <input
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          type="date"
        />
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
      </div>

      <div className="form-field">
        <label>Contraseña</label>
        <input
          name="passwordHash"
          value={form.passwordHash}
          onChange={handleChange}
          type="password"
          placeholder="*********"
        />
      </div>

      {/* === BOTONES SEGÚN ROL === */}
      {!isAdmin && (
        <button type="submit">
          Crear cuenta
        </button>
      )}

      {isAdmin && editingUser && (
        <>
        <div className="button-group">
          <button type="button" onClick={handleUpdate}>
            Actualizar
          </button>
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
          </div>
        
        </>
      )}

      {isAdmin && !editingUser && (
        <button type="button" onClick={handleCreate}>
          Crear usuario
        </button>
      )}
    </form>
  );
}
