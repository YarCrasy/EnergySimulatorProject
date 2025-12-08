import { Link } from "react-router-dom";
import "./About.css";
import domestic from "../../images/domestic.jpg";
import comunity from "../../images/comunity.jpg";
import industrial from "../../images/industrial.jpg";
import greenWorld from "../../images/greenWorld.jpg";
import innovation from "../../images/innovation.jpg";

const pillars = [
  {
    title: "Sostenibilidad medible",
    detail:
      "Integramos métricas de emisiones y consumo para que cada simulación muestre el impacto real.",
    image: greenWorld,
  },
  {
    title: "Innovación aplicada",
    detail:
      "Modelos híbridos solares–eólicos, curvas de carga inteligentes y colaboración multiusuario.",
    image: innovation,
  },
  {
    title: "Transparencia total",
    detail:
      "Datos auditables, versiones controladas y reportes ejecutivos listos para compartir.",
    image: greenWorld,
  },
];

const segments = [
  {
    name: "Residencial inteligente",
    value: "60-70%",
    image: domestic,
    copy: "Optimiza cubiertas y consumo diario con escenarios solares precisos.",
  },
  {
    name: "Comunidades energéticas",
    value: "+45%",
    image: comunity,
    copy: "Coordina cooperativas y barrios con reglas claras de reparto y monitoreo.",
  },
  {
    name: "Industrial 24/7",
    value: "-30% OPEX",
    image: industrial,
    copy: "Integra almacenamiento y genera reportes de continuidad para ejecutivos.",
  },
];

const milestones = [
  { year: "2019", label: "Nace el simulador", detail: "Primer MVP para comparar techos residenciales." },
  { year: "2021", label: "Expansión LATAM", detail: "Equipos en 4 países colaboran en la misma plataforma." },
  { year: "2023", label: "Modo industrial", detail: "Nuevos modelos híbridos y tableros ejecutivos." },
  { year: "2025", label: "IA operativa", detail: "Recomendaciones automáticas de CAPEX vs OPEX." },
];

function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <p className="about-eyebrow">Quiénes somos</p>
        <div className="about-hero__layout">
          <div>
            <h1>Equipos de energía renovable conectados a un mismo flujo digital</h1>
            <p>
              Aceleramos el diseño, evaluación y seguimiento de proyectos solares y eólicos con herramientas creadas para ingeniería, finanzas y operaciones.
            </p>
            <div className="about-stats">
              <article>
                <span>+320</span>
                <p>Proyectos modelados</p>
              </article>
              <article>
                <span>18 GWh</span>
                <p>Energía simulada</p>
              </article>
              <article>
                <span>7 países</span>
                <p>Equipos activos</p>
              </article>
            </div>
          </div>
          <div className="about-hero__visual" >
            <img src={domestic} alt="Visual representation of renewable energy" />
          </div>
        </div>
      </section>

      <section className="about-pillars">
        {pillars.map((pillar) => (
          <article key={pillar.title}>
            <div
              className="pillar-image"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(4, 11, 24, 0.35), rgba(4, 11, 24, 0.75)), url(${pillar.image})`,
              }}
            />
            <h3>{pillar.title}</h3>
            <p>{pillar.detail}</p>
          </article>
        ))}
      </section>

      <section className="about-segments">
        <header>
          <p>Escenarios de aplicación</p>
          <h2>Desde hogares hasta plantas industriales 24/7</h2>
        </header>
        <div className="segment-grid">
          {segments.map((segment) => (
            <article key={segment.name}>
              <div
                className="segment-image"
                style={{
                  backgroundImage: `linear-gradient(160deg, rgba(4, 11, 24, 0.4), rgba(4, 11, 24, 0.8)), url(${segment.image})`,
                }}
              >
                <span>{segment.value}</span>
                <p>{segment.name}</p>
              </div>
              <p className="segment-copy">{segment.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-milestones">
        <header>
          <p>Línea de tiempo</p>
          <h2>Iteramos junto a clientes que impulsan la transición energética</h2>
        </header>
        <div className="milestone-track">
          {milestones.map((item) => (
            <article key={item.year}>
              <span>{item.year}</span>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <div>
          <h3>¿Listo para proyectar tu próxima planta?</h3>
          <p>
            Regístrate para acceder al simulador, comparte escenarios con tu equipo y mantén control total del CAPEX y OPEX.
          </p>
        </div>
        <div className="about-cta__actions">
          <Link to="/register" className="btn-primary">Crear cuenta</Link>
          <Link to="/legals" className="btn-ghost">Ver compromisos</Link>
        </div>
      </section>
    </main>
  );
}

export default About;
