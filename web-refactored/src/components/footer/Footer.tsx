import { Link } from "react-router-dom";

import "./Footer.css";

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook", short: "f" },
  { href: "https://twitter.com", label: "X", short: "x" },
  { href: "https://instagram.com", label: "Instagram", short: "ig" },
] as const;

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-brand">
        <strong>Energy Simulator</strong>
        <p>Diseno, simulacion y seguimiento para proyectos energeticos.</p>
      </div>

      <div className="footer-social">
        {socialLinks.map((social) => (
          <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
            <span aria-hidden="true">{social.short}</span>
          </a>
        ))}
      </div>

      <div className="footer-links">
        <Link to="/about">Sobre nosotros</Link>
        <Link to="/legals">Legales</Link>
      </div>
    </footer>
  );
}

export default Footer;
