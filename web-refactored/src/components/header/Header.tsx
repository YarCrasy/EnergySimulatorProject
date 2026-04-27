import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", isMenuOpen);

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isMenuOpen]);

  const handleAuthClick = () => {
    setIsMenuOpen(false);

    if (isAuthenticated) {
      logout();
      navigate("/");
      return;
    }

    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`app-header ${isMenuOpen ? "menu-is-open" : ""}`}>
        <Logo />

        <div className="desktop-menu">
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
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-label={isMenuOpen ? "Cerrar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          aria-controls="header-menu"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </header>

      <button
        type="button"
        className={`menu-backdrop ${isMenuOpen ? "is-open" : ""}`}
        aria-label="Cerrar menu"
        onClick={closeMenu}
      />

      <aside className={`header-menu ${isMenuOpen ? "is-open" : ""}`} id="header-menu" aria-hidden={!isMenuOpen}>
        <button type="button" className="menu-close" aria-label="Cerrar menu" onClick={closeMenu}>
          <FaTimes size={20} />
        </button>

        <nav aria-label="Navegacion principal">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} onClick={closeMenu}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="auth-button" onClick={handleAuthClick}>
          {isAuthenticated ? "Cerrar sesion" : "Iniciar sesion"}
        </button>
      </aside>
    </>
  );
}

export default Header;
