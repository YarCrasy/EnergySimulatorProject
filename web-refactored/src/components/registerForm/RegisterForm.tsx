import { useNavigate } from "react-router-dom";

import useRegisterForm from "./useRegisterForm";
import type { EditableUser } from "./types";
import "./RegisterForm.css";

interface RegisterFormProps {
  editingUser?: EditableUser | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RegisterForm({ editingUser, onSuccess, onCancel }: RegisterFormProps) {
  const navigate = useNavigate();
  const isEditing = Boolean(editingUser);
  const { form, errors, submitting, handleChange, handleCreate, handleUpdate } = useRegisterForm(editingUser, onSuccess);

  const handleSelfRegistration = async (event: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLButtonElement>) => {
    const created = await handleCreate(event);
    if (created) {
      navigate("/login");
    }
  };

  return (
    <form className="register-form" onSubmit={isEditing ? handleUpdate : handleSelfRegistration}>
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
        <input id="register-dateOfBirth" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} type="date" />
        {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="register-email">Correo electronico</label>
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
        <label htmlFor="register-passwordHash">Contrasena</label>
        <input
          id="register-passwordHash"
          name="passwordHash"
          value={form.passwordHash}
          onChange={handleChange}
          type="password"
          placeholder="********"
        />
        {errors.passwordHash && <span className="error">{errors.passwordHash}</span>}
      </div>

      <div className="button-group">
        {isEditing ? (
          <>
            <button type="submit" disabled={submitting}>
              {submitting ? "Actualizando..." : "Actualizar"}
            </button>
            <button type="button" onClick={onCancel}>
              Cancelar
            </button>
          </>
        ) : (
          <button type="submit" disabled={submitting}>
            {submitting ? "Creando..." : "Crear"}
          </button>
        )}
      </div>
    </form>
  );
}
