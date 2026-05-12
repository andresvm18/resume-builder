import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/auth.service";
import { useAuth } from "../../../shared/context/useAuth";
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
      setError("Correo o contraseña inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal">
      <div className="login-modal__header">
        <h2 className="login-modal__title">Bienvenido de nuevo</h2>
        <p className="login-modal__subtitle">
          Inicia sesión para continuar construyendo tu currículum optimizado para ATS.
        </p>
      </div>

      <form className="login-modal__form" onSubmit={handleLogin}>
        <div className="login-modal__field">
          <label htmlFor="login-email" className="login-modal__label">
            Correo electrónico
          </label>
          <div className="login-modal__input-wrapper">
            <svg className="login-modal__input-icon" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 5.5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>

            <input
              id="login-email"
              type="email"
              placeholder="tu@ejemplo.com"
              className="login-modal__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="login-modal__field">
          <label htmlFor="login-password" className="login-modal__label">
            Contraseña
          </label>
          <div className="login-modal__password-wrapper">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="login-modal__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="login-modal__toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>

      <p className="login-modal__footer">
        ¿No tienes una cuenta?{" "}
        <Link to="/register" className="login-modal__footer-link">
          Crear una
        </Link>
      </p>
    </div>
  );
}