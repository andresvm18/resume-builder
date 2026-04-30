import { Link } from "react-router-dom";
import Header from "../../../shared/components/layout/Header";
import AtsScoreCard from "../components/AtsScoreCard";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <Header />

      {/* Hero */}
      <section className="hero">
        <div>
          <span className="hero__badge">Plataforma de Currículums Optimizados para ATS</span>
          <h2 className="hero__title">Crea currículums que pasan filtros y consiguen entrevistas.</h2>
          <p className="hero__description">Crea currículums limpios y compatibles con ATS con vista previa en tiempo real...</p>
          <div className="hero__actions">
            <Link to="/resume-builder" className="btn-primary">Crear tu Currículum</Link>
          </div>
        </div>
        <div className="hero__visual">
          <AtsScoreCard />
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <p className="features__eyebrow">Por qué elegir ResumeBuilder</p>
        <h3 className="features__title">Todo lo que necesitas para conseguir el puesto.</h3>
        <div className="features__grid">
          <div className="feature-card">
            <div className="feature-card__icon">📄</div>
            <h4 className="feature-card__title">Optimización ATS</h4>
            <p className="feature-card__description">Maximiza la compatibilidad con los sistemas de seguimiento de candidatos desde el primer día.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">⬇</div>
            <h4 className="feature-card__title">Exportar a PDF</h4>
            <p className="feature-card__description">Descarga currículums profesionales listos para reclutadores con un solo clic.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta__inner">
          <h3 className="cta__title">Comienza a construir tu próxima <em>oportunidad</em> hoy.</h3>
          <p className="cta__description">Únete a profesionales que crean currículums que destacan.</p>
          <div className="cta__action">
            <Link to="/register" className="btn-primary">Comenzar</Link>
          </div>
        </div>
      </section>
    </main>
  );
}