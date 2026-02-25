import { Link } from "react-router-dom";
import "./NotFound.css";

const suggestions = [
  { label: "Inicio", path: "/" },
  { label: "Simulador", path: "/simulator" },
  { label: "Proyectos", path: "/projects" },
];

function NotFound() {
  return (
    <main className="notfound-page">
      <section className="notfound-card">
        <p className="notfound-eyebrow">Error 404</p>
        <h1>La ruta solicitada no existe</h1>
        <p className="notfound-lede">
          Es posible que el enlace esté desactualizado o que hayas escrito mal la dirección.
          Regresa a un flujo conocido para continuar diseñando tu próximo proyecto energético.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="btn-primary">Volver al inicio</Link>
          <Link to="/projects" className="btn-ghost">Ver proyectos</Link>
        </div>
        <div className="notfound-suggestions">
          {suggestions.map((item) => (
            <Link key={item.label} to={item.path}>
              <span>↗</span>
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default NotFound;
