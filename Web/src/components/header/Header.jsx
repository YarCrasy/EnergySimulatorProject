import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      {/* LOGO */}
      <div className="header-logo">
        <Link to="/">Solarium</Link>
      </div>

      {/* MENÚ CENTRAL */}
      <nav className="header-nav">
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/simulator">Simulador</Link></li>
          <li><Link to="/projects">Proyectos</Link></li>
          <li><Link to="/locations">Ubicaciones</Link></li>
          <li><Link to="/about">Sobre nosotros</Link></li>
        </ul>
      </nav>

      {/* BOTÓN LOGIN */}
      <div className="header-login">
        <Link className="login-btn" to="/login">
          Iniciar sesión
        </Link>
      </div>
    </header>
  );
}

export default Header;
