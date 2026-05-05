import { FaArrowRight, FaCubes, FaUser, FaUsers } from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../../auth/auth";
import "./AdminHome.css";

function AdminHome() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to="/projects" replace />;
  }

  return (
    <main className="administration-home">
      <section className="administration-home__hero">
        <p className="administration-home__eyebrow">Panel de administracion</p>
        <h1>Centro de gestion</h1>
        <p>
          Accede rapidamente a la administracion de usuarios y al catalogo de
          elementos del simulador.
        </p>
      </section>

      <section className="administration-home__grid">
        <Link to="/administration/users" className="administration-card">
          <FaUsers aria-hidden="true" />
          <h2>Usuarios</h2>
          <p>Gestiona altas, ediciones de perfil y control de accesos.</p>
          <span>
            Abrir modulo <FaArrowRight aria-hidden="true" />
          </span>
        </Link>

        <Link to="/administration/elements" className="administration-card">
          <FaCubes aria-hidden="true" />
          <h2>Elementos</h2>
          <p>Edita el catalogo de elementos usados en simulacion.</p>
          <span>
            Abrir modulo <FaArrowRight aria-hidden="true" />
          </span>
        </Link>

        <Link to="/projects" className="administration-card">
          <FaUser aria-hidden="true" />
          <h2>Vista usuario</h2>
          <p>Accede al flujo normal de proyectos y simulaciones del usuario.</p>
          <span>
            Abrir modulo <FaArrowRight aria-hidden="true" />
          </span>
        </Link>
      </section>
    </main>
  );
}

export default AdminHome;
