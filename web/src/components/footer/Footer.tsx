import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="social-media-container">
        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="facebook" data-label="Facebook">
          <FaFacebook size={24} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="twitter" data-label="Twitter">
          <FaTwitter size={24} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="instagram" data-label="Instagram">
          <FaInstagram size={24} />
        </a>
      </div>
      <div className="footer-legals">
        <Link to="/locations">Nuestras Ubicaciones</Link>
      </div>
      <div className="footer-legals">
        <Link to="/legals">Terminos y Condiciones</Link>
      </div>
    </footer>
  );
}

export default Footer;
