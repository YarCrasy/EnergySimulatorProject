import { Link } from "react-router-dom";

import RegisterForm from "../../components/registerForm/RegisterForm";
import registerImg from "@jpg/registerImg.jpg";
import "./Register.css";

const onboardingSteps = [
  "Define el proposito energetico del proyecto",
  "Carga datos de consumo y ubicacion",
  "Comparte el simulador con tu equipo",
];

const trustMetrics = [
  { label: "Equipos colaborando", value: "12" },
  { label: "Paises de operacion", value: "3" },
  { label: "Horas ahorradas", value: "+4567" },
];

function Register() {
  return (
    <main className="register-page">
      <div className="register-shell">
        <section className="register-hero">
          <p className="register-eyebrow">Onboarding guiado</p>
          <h1>Incorpora a tu equipo y acelera el analisis energetico</h1>
          <p className="register-lede">
            Obten acceso al simulador, crea escenarios solares o eolicos en minutos y manten un historial auditable de decisiones compartidas.
          </p>
          <ul className="register-checklist">
            {onboardingSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <div className="register-metrics">
            {trustMetrics.map((metric) => (
              <article key={metric.label}>
                <span>{metric.value}</span>
                <p>{metric.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="register-card">
          <header>
            <p>Nuevo usuario</p>
            <h2>Obten credenciales seguras para tu organizacion</h2>
          </header>
          <RegisterForm />
          <p className="register-login-hint">
            Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
          </p>
        </section>
      </div>

      <section
        className="register-visual"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(4, 11, 24, 0.55), rgba(4, 11, 24, 0.85)), url(${registerImg})`,
        }}
      >
        <div className="register-visual__overlay">
          <h3>Infraestructura pensada para proyectos criticos</h3>
          <p>Sincroniza documentacion, simulaciones y reportes en un mismo espacio para mantener a toda tu organizacion coordinada.</p>
        </div>
      </section>
    </main>
  );
}

export default Register;
