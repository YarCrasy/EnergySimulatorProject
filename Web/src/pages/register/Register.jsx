import "./Register.css";
import register from "../../images/register.jpg";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validaciones aquí...
    navigate("/projects");
  };

  return (
    <div
      className="register"
      style={{
        background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${register}) center/cover no-repeat`,
      }}
    >
      <div className="form">
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Nombre completo</label>
            <input type="text" placeholder="Juan Lopez" required />
          </div>

          <div className="form-field">
            <label>Fecha nacimiento</label>
            <input type="date" required />
          </div>

          <div className="form-field">
            <label>Correo electrónico</label>
            <input type="email" placeholder="ejemplo@gmail.com" required />
          </div>

          <div className="form-field">
            <label>Contraseña</label>
            <input type="password" placeholder="*********" required />
          </div>

          <div className="form-field">
            <label>Repita contraseña</label>
            <input type="password" placeholder="*********" required />
          </div>

          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="link-button"
          >
            Crear cuenta
          </button>
        </form>
      </div>
    </div>
  );
}
