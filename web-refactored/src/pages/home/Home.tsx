import { useNavigate } from "react-router-dom";

import hero from "../../assets/hero.png";
import "./Home.css";

const stats = [
  { label: "Proyectos Analizados", value: "123" },
  { label: "CO2 evitado", value: "45 kt" },
  { label: "Horas simuladas", value: "6.7k" },
];

const highlights = [
  {
    title: "Modelos de precision",
    detail: "Integramos parametros climaticos y de consumo reales para aproximaciones confiables.",
  },
  {
    title: "Escenarios instantaneos",
    detail: "Crea variantes ilimitadas y compara CAPEX / OPEX en segundos.",
  },
  {
    title: "Inteligencia colaborativa",
    detail: "Comparte simulaciones con tu equipo y consolida decisiones en un mismo panel.",
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="hero-eyebrow">Simulador integral</p>
          <h1>Disena tu proxima planta de energia renovable con datos visibles y accionables</h1>
          <p className="hero-lede">
            Carga consumos reales, evalua escenarios solares y eolicos y comparte resultados con tu equipo
            en un entorno seguro respaldado por analitica avanzada.
          </p>
          <div className="hero-cta">
            <button type="button" className="cta-primary" onClick={() => navigate("/simulator")}>
              Comenzar simulacion
            </button>
            <button type="button" className="cta-ghost" onClick={() => navigate("/projects")}>
              Explorar proyectos
            </button>
          </div>
          <div className="hero-stats">
            {stats.map((stat) => (
              <article key={stat.label}>
                <span>{stat.value}</span>
                <p>{stat.label}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div
            className="hero-image"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, rgba(162, 255, 134, 0.2), transparent 55%), url(${hero})`,
            }}
          >
            <div className="hero-visual__glow" />
          </div>
        </div>
      </section>

      <section className="home-highlights">
        <div className="section-head">
          <p>Workflow estrategico</p>
          <h2>Unifica descubrimiento, simulacion y ejecucion</h2>
          <span>Potencia tus decisiones energeticas con herramientas disenadas para equipos modernos.</span>
        </div>
        <div className="highlight-grid">
          {highlights.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
