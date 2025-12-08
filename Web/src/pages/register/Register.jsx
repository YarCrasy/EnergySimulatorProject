import { Link } from "react-router-dom";
import "./Register.css";
import registerImg from "../../images/registerImg.jpg";
import RegisterForm from "../../components/registerForm/RegisterForm";

const onboardingSteps = [
  "Define el propósito energético del proyecto",
  "Carga datos de consumo y ubicación",
  "Comparte el simulador con tu equipo",
];

const trustMetrics = [
  { label: "Equipos colaborando", value: "12" },
  { label: "Países de operación", value: "3" },
  { label: "Horas ahorradas", value: "+4567" },
];

export default function Register() {
  return (
    <main className="register-page">
      <div className="register-shell">
        <section className="register-hero">
          <p className="register-eyebrow">Onboarding guiado</p>
          <h1>Incorpora a tu equipo y acelera el análisis energético</h1>
          <p className="register-lede">
            Obtén acceso al simulador, crea escenarios solares o eólicos en minutos y mantén un historial auditable de decisiones compartidas.
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
            <h2>Obtén credenciales seguras para tu organización</h2>
          </header>
          <RegisterForm />
          <p className="register-login-hint">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </section>
      </div>

      <section className="register-visual" style={{
        backgroundImage: `linear-gradient(135deg, rgba(4, 11, 24, 0.55), rgba(4, 11, 24, 0.85)), url(${registerImg})`,
      }}>
        <div className="register-visual__overlay">
          <h3>Infraestructura pensada para proyectos críticos</h3>
          <p>Sincroniza documentación, simulaciones y reportes en un mismo espacio para mantener a toda tu organización coordinada.</p>
        </div>
      </section>
    </main>
  );
}
