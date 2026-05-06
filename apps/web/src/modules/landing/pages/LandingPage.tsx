import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../auth/services/auth.service";
import Header from "../../../shared/components/layout/Header";
import AtsScoreCard from "../components/AtsScoreCard";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleCreateResume = () => {
    const token = getAuthToken();
    if (token) {
      navigate("/resume-builder");
    } else {
      navigate("/login");
    }
  };

  const handleCTA = () => {
    const token = getAuthToken();
    if (token) {
      navigate("/resume-builder");
    } else {
      navigate("/register");
    }
  };

  return (
    <main className="landing-page">
      <Header />

      {/* Hero */}
      <section className="hero">
        <div>
          <span className="hero__badge">Plataforma de Currículums Optimizados para ATS</span>
          <h2 className="hero__title">Construye un currículum profesional en minutos.</h2>
          <p className="hero__description">Optimizado para ATS, exportable a PDF y diseñado para ayudarte a presentarte mejor.</p>
          <div className="hero__actions">
            <button onClick={handleCreateResume} className="btn-primary">
              Crear tu Currículum
            </button>
          </div>
        </div>
        <div className="hero__visual">
          <AtsScoreCard />
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <p className="features__eyebrow">Por qué elegir ResumeBuilder</p>
        <h3 className="features__title">Herramientas para presentar tu experiencia con claridad.</h3>
        <div className="features__grid">
          <div className="feature-card">
            <div className="feature-card__icon">📄</div>
            <h4 className="feature-card__title">Optimización ATS</h4>
            <p className="feature-card__description">Analiza la compatibilidad de tu currículum con sistemas de seguimiento de candidatos.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">⬇</div>
            <h4 className="feature-card__title">Exportar a PDF</h4>
            <p className="feature-card__description">Descarga currículums en formato profesional, listos para enviar con un solo clic.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta__inner">
          <h3 className="cta__title">Empieza a construir tu próximo <em>currículum</em> hoy.</h3>
          <p className="cta__description">Una herramienta simple para presentar tu perfil de forma clara y profesional.</p>
          <div className="cta__action">
            <button onClick={handleCTA} className="btn-primary">
              Comenzar
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}