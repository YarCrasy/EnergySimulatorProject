import { useAuth } from "../../../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="navBar">
      <header className="nav-header">
        <nav>
          <ul>
            <li>
              <Link to="/administration/users">Usuarios</Link>
            </li>
            <li>
              <Link to="/panels">Paneles</Link>
            </li>
            <li>
              <Link to="/administration/receivers">Receptores</Link>
            </li>
          </ul>
        </nav>
        {/* Button login */}
        <button
          className="auth-button2"
          onClick={user ? logout : () => navigate("/login")}
        >
          {user ? "Cerrar sesión" : "Iniciar sesión"}
        </button>
      </header>
    </div>
  );
}
