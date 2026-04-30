import { Link } from "react-router-dom";
import Header from "../../../shared/components/layout/Header";
import "./DashboardPage.css";

// Example Data (connect with API later) 
const resumes = [
  {
    id: 1,
    title: "Currículum Ingeniero de Software",
    description: "Currículum optimizado para posiciones técnicas en empresas FAANG.",
    updatedAt: "hace 2 días",
    atsScore: 94,
    status: "ats",
  },
  {
    id: 2,
    title: "Currículum Product Manager",
    description: "Enfocado en estrategia de producto, liderazgo y decisiones basadas en datos.",
    updatedAt: "hace 5 días",
    atsScore: 87,
    status: "ats",
  },
  {
    id: 3,
    title: "Desarrollador Frontend",
    description: "Especializado en React, TypeScript y tecnologías web modernas.",
    updatedAt: "hace 1 semana",
    atsScore: 76,
    status: "draft",
  },
];

const stats = {
  totalResumes: resumes.length,
  avgAtsScore: Math.round(resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0) / resumes.length),
  pendingOptimizations: resumes.filter(r => (r.atsScore || 0) < 85).length,
};

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <Header />

      {/* Decorative orbs */}
      <div className="dashboard-page__orb-top"></div>
      <div className="dashboard-page__orb-bottom"></div>

      <div className="dashboard-page__content">
        {/* Welcome Section */}
        <div className="dashboard-page__welcome">
          <div className="dashboard-page__welcome-text">
            <h1 className="dashboard-page__greeting">
              Bienvenido de nuevo
            </h1>
            <p className="dashboard-page__subtext">
              Gestiona tus currículums y crea nuevas oportunidades.
            </p>
          </div>

          <Link to="/resume-builder" className="dashboard-page__create-btn">
            Crear Currículum
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-page__stats">
          <div className="stat-card">
            <div className="stat-card__label">Total de Currículums</div>
            <div className="stat-card__value">
              {stats.totalResumes}
              <span className="stat-card__unit">documentos</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__label">Puntuación ATS Promedio</div>
            <div className="stat-card__value">
              {stats.avgAtsScore}
              <span className="stat-card__unit">%</span>
            </div>
            {stats.avgAtsScore >= 85 ? (
              <div className="stat-card__trend stat-card__trend--up">
                ↑ Excelente
              </div>
            ) : (
              <div className="stat-card__trend stat-card__trend--down">
                ↓ Necesita mejorar
              </div>
            )}
          </div>

          <div className="stat-card">
            <div className="stat-card__label">Necesitan Optimización</div>
            <div className="stat-card__value">
              {stats.pendingOptimizations}
              <span className="stat-card__unit">currículums</span>
            </div>
          </div>
        </div>

        {/* Resumes Section */}
        <div className="dashboard-page__section-header">
          <h2 className="dashboard-page__section-title">Tus Currículums</h2>
        </div>

        <div className="dashboard-page__grid">
          {resumes.map((resume, index) => (
            <div 
              key={resume.id} 
              className="resume-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="resume-card__content">
                <div className="resume-card__header">
                  <span className={`resume-card__badge resume-card__badge--${resume.status}`}>
                    {resume.status === "ats" ? "✅ Listo para ATS" : "📝 Borrador"}
                  </span>
                  <span className="resume-card__date">
                    Actualizado {resume.updatedAt}
                  </span>
                </div>

                <h3 className="resume-card__title">{resume.title}</h3>
                <p className="resume-card__description">{resume.description}</p>

                {resume.atsScore && (
                  <div className="resume-card__score">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Puntuación ATS: {resume.atsScore}%
                  </div>
                )}

                <div className="resume-card__actions">
                  <Link to={`/resume-builder/${resume.id}`} className="resume-card__edit-btn">
                    Editar
                  </Link>
                  <button className="resume-card__delete-btn">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State Card */}
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 4v16m8-8H4" />
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
            </div>
            <h3 className="empty-state__title">Crea tu próximo currículum</h3>
            <p className="empty-state__description">
              Comienza a construir un CV listo para reclutadores en minutos.
            </p>
            <Link to="/resume-builder" className="empty-state__btn">
              Nuevo Currículum
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}