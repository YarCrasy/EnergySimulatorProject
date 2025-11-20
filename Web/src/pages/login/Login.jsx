import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext"; 
import "./Login.css";
import loginImg from "../../images/loginImg.jpg";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    try {
      await login(email, password); // Valida usuario y guarda en localStorage
      navigate("/projects");        // Redirige a Projects
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <main className="login-page">
      <div>
        <div
          className="login-image"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${loginImg}) center/cover no-repeat`,
          }}
        ></div>

        <div className="login-panel">
          <form className="login-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>

            <div>
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" required />
            </div>

            <button type="submit">Login</button>

            <a href="#" target="_blank">Olvidé la contraseña</a>

            <button
              type="button"
              onClick={() => navigate("/register")}
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;
