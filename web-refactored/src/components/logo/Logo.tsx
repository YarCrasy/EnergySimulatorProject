import { Link } from "react-router-dom";

import "./Logo.css";
import logoImage from "../../assets/logo.webp";

function Logo() {
  return (
    <Link to="/" className="logo-link" aria-label="Ir a inicio">
      <span className="logo-mark" aria-hidden="true">
        {/* <span className="logo-mark__dot" /> */}
        <img src={logoImage} alt="Logo de Energy Simulator" className="logo-img" />
      </span>
      <span className="logo-copy">
        <strong>Energy</strong>
        <span>Simulator</span>
      </span>
    </Link>
  );
}

export default Logo;
