import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Logo.css";

export default function Logo() {
  return (
    <Link to="/" className="logo-container">
      <img src={logo} alt="Renewable Energy Project — logotipo" className="logo-img" />
    </Link>
  );
}
