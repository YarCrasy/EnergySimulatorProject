import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../hooks/AuthContext";
import "./registerform.css";

export default function RegisterForm({ editingUser, clearEditing }) {
  const { user } = useAuth();
  console.log("ROL DEL USUARIO ACTUAL:", user?.role);
 
  const isAdmin = user?.role === "admin";

  const [form, setForm] = useState({
    name: "",
    birthdate: "",
    email: "",
    password: "",
  });

  // === Cuando el admin toca "Editar" ===
  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name,
        birthdate: editingUser.birthdate,
        email: editingUser.email,
        password: "", // opcional
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user", form);
      alert("Usuario creado");
      setForm({ name: "", birthdate: "", email: "", password: "" });
    } catch (err) {
      console.error("Error creando usuario:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/user/${editingUser.id}`, form);
      alert("Usuario actualizado");
      clearEditing();
    } catch (err) {
      console.error("Error actualizando:", err);
    }
  };

  return (
    <form className="register-form" onSubmit={handleCreate}>
      <div className="form-field">
        <label>Nombre completo</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
          placeholder="Juan Lopez"
        />
      </div>

      <div className="form-field">
        <label>Fecha nacimiento</label>
        <input
          name="birthdate"
          value={form.birthdate}
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
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="*********"
        />
      </div>

      {/* === BOTONES SEGÚN ROL === */}

      {!isAdmin && <button type="submit">Crear cuenta</button>}

      {isAdmin && editingUser && (
        <>
          <button type="button" onClick={handleUpdate}>
            Actualizar
          </button>

          <button type="button" onClick={clearEditing} style={{ marginLeft: 10 }}>
            Cancelar
          </button>
        </>
      )}

      {isAdmin && !editingUser && (
        <button type="submit">Crear usuario</button>
      )}
    </form>
  );
}
