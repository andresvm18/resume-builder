import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserResumes } from "../../resume-builder/services/resume.service";
import Header from "../../../shared/components/layout/Header";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const data = await fetchUserResumes();
        setResumes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadResumes();
  }, []);

  // Dynamic Stats
  const stats = {
    totalResumes: resumes.length,
    avgAtsScore:
      resumes.length > 0
        ? Math.round(
            resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0) /
              resumes.length
          )
        : 0,
    pendingOptimizations: resumes.filter(
      (r) => (r.atsScore || 0) < 85
    ).length,
  };

  return (
    <main className="dashboard-page">
      <Header />

      {/* Decorative orbs */}
      <div className="dashboard-page__orb-top"></div>
      <div className="dashboard-page__orb-bottom"></div>

      <div className="dashboard-page__content">
        {/* Welcome */}
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

        {/* Stats */}
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

        {/* Section title */}
        <div className="dashboard-page__section-header">
          <h2 className="dashboard-page__section-title">
            Tus Currículums
          </h2>
        </div>

        {/* Loading */}
        {loading && <p>Cargando currículums...</p>}

        {/* Resumes */}
        {!loading && resumes.length > 0 && (
          <div className="dashboard-page__grid">
            {resumes.map((resume, index) => (
              <div
                key={resume.id}
                className="resume-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="resume-card__content">
                  <div className="resume-card__header">
                    <span className="resume-card__badge">
                      📄 CV guardado
                    </span>

                    <span className="resume-card__date">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="resume-card__title">
                    {resume.title}
                  </h3>

                  <p className="resume-card__description">
                    CV generado automáticamente
                  </p>

                  <div className="resume-card__actions">
                    <Link
                      to={`/resume-builder/${resume.id}`}
                      className="resume-card__edit-btn"
                    >
                      Editar
                    </Link>

                    <button className="resume-card__delete-btn">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && resumes.length === 0 && (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 4v16m8-8H4" />
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
            </div>

            <h3 className="empty-state__title">
              Crea tu próximo currículum
            </h3>

            <p className="empty-state__description">
              Comienza a construir un CV listo para reclutadores en minutos.
            </p>

            <Link
              to="/resume-builder"
              className="empty-state__btn"
            >
              Nuevo Currículum
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}