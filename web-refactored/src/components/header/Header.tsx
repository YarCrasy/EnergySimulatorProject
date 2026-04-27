import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/auth";
import Logo from "../logo/Logo";
import "./Header.css";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/projects", label: "Proyectos" },
  { to: "/simulator", label: "Simulador" },
  { to: "/about", label: "Sobre nosotros" },
] as const;

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
      navigate("/");
      return;
    }

    navigate("/login");
  };

  return (
    <header className="app-header">
      <Logo />

      <nav aria-label="Navegacion principal">
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === "/"}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="auth-button" onClick={handleAuthClick}>
        {isAuthenticated ? "Cerrar sesion" : "Iniciar sesion"}
      </button>
    </header>
  );
}

export default Header;
