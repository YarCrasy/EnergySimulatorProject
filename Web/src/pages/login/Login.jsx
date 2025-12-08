import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { createProject } from "../../api/projects";
import "./Login.css";
import loginImg from "../../images/loginImg.jpg";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const redirectToSimulator = Boolean(location.state?.redirectToSimulator);

  // Manejar el envío del formulario de login
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const loggedUser = await login(email, password); // login devuelve {id,name,role}
      const fallbackPath = loggedUser.role === "admin" ? "/administration/users" : "/projects";

      if (redirectToSimulator) {
        try {
          const newProjectPayload = {
            name: "Nuevo Proyecto",
            energyEnough: false,
            energyNeeded: 0,
            userId: loggedUser.id,
          };

          const createdProject = await createProject(newProjectPayload);
          const projectId = createdProject?.id;
          navigate(projectId ? `/simulator/${projectId}` : "/simulator");
          return;
        } catch (creationError) {
          console.error("No se pudo preparar el simulador", creationError);
          alert("No se pudo iniciar el simulador. Intenta nuevamente.");
          navigate(fallbackPath);
          return;
        }
      }

      // Redirección según rol
      navigate(fallbackPath);

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
          <h2>Iniciar sesión</h2>

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
