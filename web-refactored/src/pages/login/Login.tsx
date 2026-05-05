import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createProject } from "../../api/projects";
import { useAuth, type AuthLoginResult } from "@auth/auth";
import "./Login.css";
import loginImg from "@jpg/loginImg.jpg";

const trustIndicators = [
  { label: "Disponibilidad", value: "99.9%" },
  { label: "Proyectos activos", value: "76" },
  { label: "Auditorías superadas", value: "12" },
];

const assurancePoints = [
  "Cumplimiento SOC2 y cifrado AES-256",
  "Multi-factor opcional para equipos críticos",
  "Backups diarios y monitorización continua",
];

type LoginSubmitEvent = React.SyntheticEvent<HTMLFormElement, SubmitEvent>;

function getCredentials(form: HTMLFormElement) {
  const formData = new FormData(form);

  return {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
}

function getFallbackPath(user: AuthLoginResult) {
  return user.role === "admin" ? "/administration" : "/projects";
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectToSimulator = Boolean((location.state as { redirectToSimulator?: boolean } | null)?.redirectToSimulator);

  const prepareSimulator = async (user: AuthLoginResult, fallbackPath: string) => {
    try {
      const project = await createProject({
        name: "Nuevo Proyecto",
        energyEnough: false,
        energyNeeded: 0,
        userId: user.id,
      });

      navigate(project.id ? `/simulator/${project.id}` : "/simulator");
    } catch (error) {
      console.error("No se pudo preparar el simulador", error);
      alert("No se pudo iniciar el simulador. Intenta nuevamente.");
      navigate(fallbackPath);
    }
  };

  const handleSubmit = async (event: LoginSubmitEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { email, password } = getCredentials(event.currentTarget);
      const loggedUser = await login(email, password);
      const fallbackPath = getFallbackPath(loggedUser);

      if (redirectToSimulator) {
        await prepareSimulator(loggedUser, fallbackPath);
      } else {
        navigate(fallbackPath);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Usuario o contrasena incorrectos");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-shell">
        <section className="login-panel">
          <p className="login-eyebrow">Acceso seguro</p>
          <h1>Ingresa para retomar tus simulaciones</h1>
          <p className="login-lede">
            Consolida escenarios, comparte resultados y mantén trazabilidad completa de cada decisión energética en una sola plataforma.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor="email">Email corporativo</label>
              <input type="email" id="email" name="email" placeholder="nombre@empresa.com" required />
            </div>

            <div className="form-control">
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" name="password" placeholder="••••••••" required />
            </div>

            <div className="login-actions">
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
              </button>
              <button type="button" className="btn-ghost" onClick={() => navigate("/register")}>Crear cuenta</button>
            </div>
            <p className="login-hint">
              ¿Olvidaste tu contraseña? Contactenos para reestablecer tu acceso.
            </p>
          </form>

          <div className="login-indicators">
            {trustIndicators.map((item) => (
              <article key={item.label}>
                <span>{item.value}</span>
                <p>{item.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="login-showcase">
          <div
            className="login-image"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(4, 11, 24, 0.35), rgba(4, 11, 24, 0.75)), url(${loginImg})`,
            }}
          >
            <div className="login-showcase__content">
              <p>Infraestructura preparada para auditorías y equipos distribuidos.</p>
              <ul>
                {assurancePoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
export default Login;
