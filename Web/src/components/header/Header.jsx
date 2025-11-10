import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
    return (
        <header>
            <Link to="/">Renewable Energy Project</Link>
        </header>
    );
}

export default Header;