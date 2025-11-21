import { useAuth } from "../../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header>
      <Link to="/">Logo</Link>
      <nav>
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to={user ? "/simulator" : "/login"}>Simulador</Link>
          </li>
          <li>
            <Link to={user ? "/projects" : "/login"}>Proyectos</Link>
          </li>
          <li>
            <Link to="/locations">Ubicaciones</Link>
          </li>
          <li>
            <Link to="/about">Sobre nosotros</Link>
          </li>
        </ul>
      </nav>
{/* Button login */}
      <button
        className="auth-button"
        onClick={user ? logout : () => navigate("/login")}
      >
        {user ? "Cerrar sesión" : "Iniciar sesión"}
      </button>
    </header>
  );
}

export default Header;
