import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
    return (
        <header>
            <Link to="/">Logo</Link>
            <nav>
                <ul>
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/simulator">Simulador</Link></li>
                    <li><Link to="/locations">Ubicaciones</Link></li>
                    <li><Link to="/about">Sobre nosotros</Link></li>
                </ul>
            </nav>
            <Link to="/login">Login</Link>
        </header>
    );
}

export default Header;