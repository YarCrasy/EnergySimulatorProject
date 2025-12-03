
import "./Register.css";
import registerImg from "../../images/registerImg.jpg";
import RegisterForm from "../../components/registerForm/RegisterForm";


export default function Register() {
  return (
    <div
      className="register"
      style={{
        background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${registerImg}) center/cover no-repeat`,
      }}
    >
      <div className="form">
        <h2>Nuevo usuario</h2>
        <RegisterForm />
        <p>Si ya tienes cuenta:</p>
        <a href="/login">Inicia sesión</a>
      </div>
    </div>
  );
}
