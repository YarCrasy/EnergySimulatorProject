import { useAuth } from "../../hooks/AuthContext";
import useRegisterForm from "./useRegisterForm";
import "./RegisterForm.css";

export default function RegisterForm({ editingUser, onSuccess, onCancel }) {
  const { user: currentUser, loading } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  const {
    form,
    errors,
    submitting,
    handleChange,
    handleCreate,
    handleUpdate,
  } = useRegisterForm(editingUser, onSuccess);

  if (loading) return null;

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
