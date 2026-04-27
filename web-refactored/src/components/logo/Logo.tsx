import { Link } from "react-router-dom";

import "./Logo.css";

function Logo() {
  return (
    <Link to="/" className="logo-link" aria-label="Ir a inicio">
      <span className="logo-mark" aria-hidden="true">
        <span className="logo-mark__dot" />
      </span>
      <span className="logo-copy">
        <strong>Energy</strong>
        <span>Simulator</span>
      </span>
    </Link>
  );
}

export default Logo;
