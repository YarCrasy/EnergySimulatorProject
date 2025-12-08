import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import "./Home.css";
import home from "../../images/home.jpg";

const stats = [
  { label: "Proyectos Analizados", value: "123" },
  { label: "CO₂ evitado", value: "45 kt" },
  { label: "Horas simuladas", value: "6.7k" },
];

const highlights = [
  {
    title: "Modelos de precisión",
    detail: "Integramos parámetros climáticos y de consumo reales para aproximaciones confiables.",
  },
  {
    title: "Escenarios instantáneos",
    detail: "Crea variantes ilimitadas y compara CAPEX / OPEX en segundos.",
  },
  {
    title: "Inteligencia colaborativa",
    detail: "Comparte simulaciones con tu equipo y consolida decisiones en un mismo panel.",
  },
];

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goToSimulator = () => {
    if (user) {
      navigate("/simulator");
      return;
    }
    navigate("/login", { state: { redirectToSimulator: true } });
  };

  const goToProjects = () => {
    navigate(user ? "/projects" : "/login");
  };

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="hero-eyebrow">Simulador integral</p>
          <h1>
            Diseña tu próxima planta de energía renovable con datos visibles y accionables
          </h1>
          <p className="hero-lede">
            Carga consumos reales, evalúa escenarios solares y eólicos y comparte resultados con tu equipo
            en un entorno seguro respaldado por analítica avanzada.
          </p>
          <div className="hero-cta">
            <button type="button" className="cta-primary" onClick={goToSimulator}>
              Comenzar simulación
            </button>
            <button type="button" className="cta-ghost" onClick={goToProjects}>
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
              backgroundImage: `radial-gradient(circle at 20% 20%, rgba(162, 255, 134, 0.2), transparent 55%), url(${home})`,
            }}
          >
            <div className="hero-visual__glow" />
          </div>
        </div>
      </section>

      <section className="home-highlights">
        <div className="section-head">
          <p>Workflow estratégico</p>
          <h2>Unifica descubrimiento, simulación y ejecución</h2>
          <span>Potencia tus decisiones energéticas con herramientas diseñadas para equipos modernos.</span>
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
    </div>
  );
}

export default Home;
