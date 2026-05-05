import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../services/auth.service";
import { useAuth } from "../../../shared/context/useAuth";
import "./RegisterModal.css";

export default function RegisterModal() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const fullName = `${name} ${middleName} ${lastName}`.trim();

      const data = await registerUser(fullName, email, password);
      login(data);

      navigate("/dashboard");
    } catch {
      setError("No se pudo crear la cuenta. Intenta con otro correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-modal">
      <div className="register-modal__header">
        <h2 className="register-modal__title">Crea tu cuenta</h2>
        <p className="register-modal__subtitle">
          Regístrate para comenzar a construir tu currículum optimizado para ATS.
        </p>
      </div>

      <form className="register-modal__form" onSubmit={handleRegister}>
        {/* Name row */}
        <div className="register-modal__row">
          <div className="register-modal__field">
            <label className="register-modal__label">Nombre</label>
            <input
              type="text"
              placeholder="Juan"
              className="register-modal__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="register-modal__field">
            <label className="register-modal__label">Segundo nombre</label>
            <input
              type="text"
              placeholder="Carlos"
              className="register-modal__input"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </div>
        </div>

        <div className="register-modal__field">
          <label className="register-modal__label">Apellido</label>
          <input
            type="text"
            placeholder="Pérez"
            className="register-modal__input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="register-modal__field">
          <label className="register-modal__label">Correo electrónico</label>
          <div className="register-modal__input-wrapper">
            <svg className="register-modal__input-icon" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 5.5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>

            <input
              type="email"
              placeholder="tu@ejemplo.com"
              className="register-modal__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password row */}
        <div className="register-modal__row">
          <div className="register-modal__field">
            <label className="register-modal__label">Contraseña</label>
            <div className="register-modal__password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="register-modal__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="register-modal__toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </button>
            </div>
          </div>

          <div className="register-modal__field">
            <label className="register-modal__label">Confirmar</label>
            <div className="register-modal__password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="register-modal__input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="register-modal__toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                👁
              </button>
            </div>
          </div>
        </div>

        {error && <p className="register-modal__error">{error}</p>}

        <button
          type="submit"
          className="register-modal__submit"
          disabled={loading}
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="register-modal__footer">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="register-modal__footer-link">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}