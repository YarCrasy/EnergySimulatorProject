import { Link } from "react-router-dom";

import "./NotFound.css";

function NotFound() {
  return (
    <main className="notfound-page">
      <section className="notfound-card">
        <h1 className="notfound-eyebrow">Error 404</h1>
        <h2>La ruta solicitada no existe</h2>
        <p className="notfound-lede">
          Es posible que el enlace este desactualizado o que hayas escrito mal
          la direccion.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="btn-primary">Volver al inicio</Link>
        </div>
      </section>
    </main>
  );
}

export default NotFound;
