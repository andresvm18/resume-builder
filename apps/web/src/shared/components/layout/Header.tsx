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
                Dashboard
              </Link>

              <span className="header__user-name">
                {user.name.split(" ")[0]}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="header__logout"
              >
                Salir
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