import { FaArrowRight, FaCubes, FaUser, FaUsers } from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";

import { useAuth } from "@auth/auth";
import "./AdminHome.css";

function AdminHome() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to="/projects" replace />;
  }

  return (
    <main className="admin-home">
      <section className="admin-hero">
        <p className="admin-badge">Panel de administración</p>
        <h1 className="admin-title">Centro de gestión</h1>
        <p className="admin-subtitle">
          Accede rapidamente a la administración de usuarios y al catalogo de
          elementos del simulador.
        </p>
      </section>

      <section className="admin-links">
        <Link to="/administration/users" className="admin-card">
          <div className="admin-card-icon">
            <FaUsers aria-hidden="true" />
          </div>
          <h2 className="admin-card-title">Usuarios</h2>
          <p className="admin-card-text">gestióna altas, ediciones de perfil y control de accesos.</p>
          <span className="admin-card-link">
            Abrir modulo <FaArrowRight aria-hidden="true" />
          </span>
        </Link>

        <Link to="/administration/elements" className="admin-card">
          <div className="admin-card-icon">
            <FaCubes aria-hidden="true" />
          </div>
          <h2 className="admin-card-title">Elementos</h2>
          <p className="admin-card-text">Edita el catalogo de elementos usados en simulacion.</p>
          <span className="admin-card-link">
            Abrir modulo <FaArrowRight aria-hidden="true" />
          </span>
        </Link>

        <Link to="/projects" className="admin-card">
          <div className="admin-card-icon">
            <FaUser aria-hidden="true" />
          </div>
          <h2 className="admin-card-title">Vista usuario</h2>
          <p className="admin-card-text">Accede al flujo normal de proyectos y simulaciones del usuario.</p>
          <span className="admin-card-link">
            Abrir modulo <FaArrowRight aria-hidden="true" />
          </span>
        </Link>
      </section>
    </main>
  );
}

export default AdminHome;
