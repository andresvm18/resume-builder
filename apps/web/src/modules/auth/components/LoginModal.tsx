import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/auth.service";
import { useAuth } from "../../../shared/context/useAuth";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";

import "./LoginModal.css";

export default function LoginModal() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      const data = await loginUser(email, password);
      login(data);
      navigate("/dashboard");
    } catch {
      setError(APP_MESSAGES.AUTH.LOGIN_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal">
      <div className="login-modal__header">
        <h2 className="login-modal__title">{APP_MESSAGES.AUTH.LOGIN_TITLE}</h2>
        <p className="login-modal__subtitle">{APP_MESSAGES.AUTH.LOGIN_SUBTITLE}</p>
      </div>

      <form className="login-modal__form" onSubmit={handleLogin}>
        <div className="login-modal__field">
          <label htmlFor="login-email" className="login-modal__label">
            {APP_MESSAGES.AUTH.EMAIL_LABEL}
          </label>
          <div className="login-modal__input-wrapper">
            <svg className="login-modal__input-icon" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 5.5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <input
              id="login-email"
              type="email"
              placeholder={APP_MESSAGES.AUTH.EMAIL_PLACEHOLDER}
              className="login-modal__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="login-modal__field">
          <label htmlFor="login-password" className="login-modal__label">
            {APP_MESSAGES.AUTH.PASSWORD_LABEL}
          </label>
          <div className="login-modal__password-wrapper">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder={APP_MESSAGES.AUTH.PASSWORD_PLACEHOLDER}
              className="login-modal__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="login-modal__toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? APP_MESSAGES.AUTH.HIDE_PASSWORD : APP_MESSAGES.AUTH.SHOW_PASSWORD}
            >
              {showPassword ? (
                <svg className="login-modal__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="3" y1="3" x2="21" y2="21" />
                </svg>
              ) : (
                <svg className="login-modal__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && <p className="login-modal__error">{error}</p>}

        <button type="submit" className="login-modal__submit" disabled={loading}>
          {loading ? APP_MESSAGES.AUTH.LOGIN_BUTTON_LOADING : APP_MESSAGES.AUTH.LOGIN_BUTTON}
        </button>
      </form>

      <p className="login-modal__footer">
        {APP_MESSAGES.AUTH.NO_ACCOUNT}{" "}
        <Link to="/register" className="login-modal__footer-link">
          {APP_MESSAGES.AUTH.CREATE_ACCOUNT_LINK}
        </Link>
      </p>
    </div>
  );
}