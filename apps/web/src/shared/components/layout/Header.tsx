import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <nav className="header__nav">
        <Link to="/" className="header__logo">
          ResumeBuilder
        </Link>

        <div className="header__actions">
          <Link to="/login" className="header__link">
            Iniciar sesión
          </Link>
          <Link to="/register" className="header__cta">
            Comenzar
          </Link>
        </div>
      </nav>
    </header>
  );
}