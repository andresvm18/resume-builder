// Header.tsx — mejorado
import { useAuth } from "../../../shared/context/useAuth";
import { useNavigate, Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const firstName = user?.name?.split(" ")[0] ?? "";
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "";

  return (
    <header className="header">
      <nav className="header__nav">
        <Link to="/" className="header__logo">
          ResumeBuilder
        </Link>

        <div className="header__actions">
          {user ? (
            <>
              <Link to="/dashboard" className="header__link">
                <i className="ti ti-layout-dashboard" aria-hidden="true" />
                <span>Dashboard</span>
              </Link>

              <div className="header__divider" />

              <Link to="/profile" className="header__avatar" title={`Perfil de ${firstName}`}>
                <span className="header__avatar-initials">{initials}</span>
                <span className="header__avatar-name">{firstName}</span>
                <i className="ti ti-chevron-down header__avatar-chevron" aria-hidden="true" />
              </Link>

              <button type="button" onClick={handleLogout} className="header__logout">
                <i className="ti ti-logout" aria-hidden="true" />
                <span>Salir</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header__link">
                Iniciar sesión
              </Link>
              <Link to="/register" className="header__cta">
                Comenzar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}