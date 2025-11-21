import "./registerform.css";

export default function RegisterForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar más lógica en el futuro
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Nombre completo</label>
        <input type="text" placeholder="Juan Lopez" />
      </div>

      <div className="form-field">
        <label>Fecha nacimiento</label>
        <input type="date" placeholder="01/08/2000" />
      </div>

      <div className="form-field">
        <label>Correo electrónico</label>
        <input type="email" placeholder="ejemplo@gmail.com" />
      </div>

      <div className="form-field">
        <label>Contraseña</label>
        <input type="password" placeholder="*********" />
      </div>

      <div className="form-field">
        <label>Repita contraseña</label>
        <input type="password" placeholder="*********" />
      </div>

      <button type="submit">Crear cuenta</button>
    </form>
  );
}
