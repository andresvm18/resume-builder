import { useAuth } from "../../../shared/context/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../context/useTheme";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";

import {
  IconMoon,
  IconSun,
  IconLayoutDashboard,
  IconLogout,
} from "@tabler/icons-react";

import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const firstName = user?.name?.split(" ")[0] ?? "";
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "";

  const themeLabel = theme === "dark" ? APP_MESSAGES.HEADER.THEME_LIGHT : APP_MESSAGES.HEADER.THEME_DARK;

  return (
    <header className="header">
      <nav className="header__nav">
        <Link to="/" className="header__logo">
          {APP_MESSAGES.HEADER.LOGO_TEXT}
        </Link>

        <div className="header__actions">
          <button
            type="button"
            onClick={toggleTheme}
            className={`header__theme-toggle header__theme-toggle--${theme}`}
            aria-label={`${APP_MESSAGES.HEADER.THEME_TOGGLE_ARIA} ${themeLabel}`}
            title={`${APP_MESSAGES.HEADER.THEME_TOGGLE_ARIA} ${themeLabel}`}
          >
            <span className="header__theme-toggle-track">
              <span className="header__theme-toggle-thumb">
                {theme === "dark" ? (
                  <IconSun size={18} stroke={1.8} />
                ) : (
                  <IconMoon size={18} stroke={1.8} />
                )}
              </span>
            </span>
          </button>

          {user ? (
            <>
              <Link to="/dashboard" className="header__link">
                <IconLayoutDashboard size={18} stroke={1.8} />
                <span>{APP_MESSAGES.HEADER.DASHBOARD_LINK}</span>
              </Link>

              <div className="header__divider" />

              <Link
                to="/profile"
                className="header__avatar"
                title={`${APP_MESSAGES.HEADER.PROFILE_TITLE} ${firstName}`}
              >
                <span className="header__avatar-initials">{initials}</span>
                <span className="header__avatar-name">{firstName}</span>
              </Link>

              <button type="button" onClick={handleLogout} className="header__logout">
                <IconLogout size={18} stroke={1.8} />
                <span>{APP_MESSAGES.HEADER.LOGOUT_BUTTON}</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header__link">
                {APP_MESSAGES.HEADER.LOGIN_LINK}
              </Link>
              <Link to="/register" className="header__cta">
                {APP_MESSAGES.HEADER.REGISTER_LINK}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}