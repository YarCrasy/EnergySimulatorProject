import { useAuth } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Header.css";
import Logo from "../logo/Logo";

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    return (
        <header className="app-header">
            <div className="logo-container"> <Logo /></div>
            <nav>
                <Link to="/">Inicio</Link>
                {!user && (
                    <Link to="/login" state={{ redirectToSimulator: true }}>
                        Simulador
                    </Link>
                )}
                <Link to={user ? "/projects" : "/login"}>Proyectos</Link>
                <Link to="/locations">Ubicaciones</Link>
                <Link to="/about">Sobre nosotros</Link>
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
