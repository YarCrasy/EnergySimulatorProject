import { useAuth } from "@/hooks/auth";
import useRegisterForm from "./useRegisterForm";
import "./RegisterForm.css";
import { useNavigate } from "react-router-dom";

export default function RegisterForm({ editingUser, onSuccess, onCancel }) {
  const { user: currentUser, loading } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  const navigate = useNavigate();

  const { form, errors, submitting, handleChange, handleCreate, handleUpdate } =
    useRegisterForm(editingUser, onSuccess);

  if (loading) return null;

  return (
    <form
      className="register-form"
      onSubmit={!isAdmin ? handleCreate : (e) => e.preventDefault()}
    >
      <div className="form-field">
        <label htmlFor="register-fullName">Nombre completo</label>
        <input
          id="register-fullName"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          type="text"
          placeholder="Juan Perez"
        />
        {errors.fullName && <span className="error">{errors.fullName}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="register-dateOfBirth">Fecha nacimiento</label>
        <input
          id="register-dateOfBirth"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          type="date"
        />
        {errors.dateOfBirth && (
          <span className="error">{errors.dateOfBirth}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="register-email">Correo electrónico</label>
        <input
          id="register-email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="ejemplo@gmail.com"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="register-passwordHash">Contraseña</label>
        <input
          id="register-passwordHash"
          name="passwordHash"
          value={form.passwordHash}
          onChange={handleChange}
          type="password"
          placeholder="********"
        />
        {errors.passwordHash && (
          <span className="error">{errors.passwordHash}</span>
        )}
      </div>

      <div className="button-group">
        {!isAdmin && (
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault(); // Esto evita el submit del form
              await handleCreate(e);
              navigate("/projects");
            }}
          >
            Crear
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
