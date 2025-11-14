import "./Footer.css";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="social-media-container">
        <a href="https://facebook.com" target="_blank">
          <FaFacebook size={24} />
        </a>
        <a href="https://twitter.com" target="_blank">
          <FaTwitter size={24} />
        </a>
        <a href="https://instagram.com" target="_blank">
          <FaInstagram size={24} />
        </a>
      </div>
      <div className="footer-contact">
        <a href="/privacy-contact">Contact</a>
      </div>
      <div className="footer-work">
        <a href="/privacy-work">Work</a>
      </div>
      <div className="footer-legals">
        <a href="/privacy-legals">Legals</a>
      </div>
    </footer>
  );
}

export default Footer;
