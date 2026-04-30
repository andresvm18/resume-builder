import { Link } from "react-router-dom";
import { useState } from "react";
import "./RegisterModal.css";

export default function RegisterModal() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="register-modal">
      <div className="register-modal__header">
        <h2 className="register-modal__title">Crea tu cuenta</h2>
        <p className="register-modal__subtitle">
          Regístrate para comenzar a construir tu currículum optimizado para ATS.
        </p>
      </div>

      <form className="register-modal__form">
        {/* Name + Middle Name on the same row */}
        <div className="register-modal__row">
          <div className="register-modal__field">
            <label className="register-modal__label">Nombre</label>
            <input type="text" placeholder="Juan" className="register-modal__input" />
          </div>
          <div className="register-modal__field">
            <label className="register-modal__label">Segundo nombre</label>
            <input type="text" placeholder="Carlos" className="register-modal__input" />
          </div>
        </div>

        <div className="register-modal__field">
          <label className="register-modal__label">Apellido</label>
          <input type="text" placeholder="Pérez" className="register-modal__input" />
        </div>

        <div className="register-modal__field">
          <label className="register-modal__label">Correo electrónico</label>
          <div className="register-modal__input-wrapper">
            <svg className="register-modal__input-icon" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M2 5.5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input type="email" placeholder="tu@ejemplo.com" className="register-modal__input" />
          </div>
        </div>

        {/* Password + Confirm on the same row */}
        <div className="register-modal__row">
          <div className="register-modal__field">
            <label className="register-modal__label">Contraseña</label>
            <div className="register-modal__password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="register-modal__input" 
              />
              <button
                type="button"
                className="register-modal__toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <svg className="register-modal__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="3" y1="3" x2="21" y2="21" />
                  </svg>
                ) : (
                  <svg className="register-modal__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
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
              />
              <button
                type="button"
                className="register-modal__toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? (
                  <svg className="register-modal__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="3" y1="3" x2="21" y2="21" />
                  </svg>
                ) : (
                  <svg className="register-modal__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className="register-modal__submit">
          Crear cuenta
        </button>
      </form>

      <p className="register-modal__footer">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="register-modal__footer-link">Iniciar sesión</Link>
      </p>
    </div>
  );
}