import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserResumes, downloadResumeById, deleteResumeById } from "../../resume-builder/services/resume.service";
import type { Resume } from "../../resume-builder/types/resume.types";
import Header from "../../../shared/components/layout/Header";
import "./DashboardPage.css";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
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

  const totalVersions = resumes.reduce(
    (acc, resume) => acc + resume.versions.length,
    0
  );

  const latestResumeDate =
    resumes.length > 0
      ? new Date(resumes[0].updatedAt || resumes[0].createdAt).toLocaleDateString()
      : "Sin actividad";

  const stats = {
    totalResumes: resumes.length,
    totalVersions,
    latestResumeDate,
  };

  const handleDownloadResume = async (resumeId: string, title: string) => {
    try {
      const blob = await downloadResumeById(resumeId);
      const url = URL.createObjectURL(blob);

      const fileName = `${title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "") || "cv"}.pdf`;

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch {
      alert("No se pudo descargar el CV.");
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar este CV? Esta acción no se puede deshacer."
    );

    if (!confirmed) return;

    try {
      await deleteResumeById(resumeId);

      setResumes((prev) =>
        prev.filter((resume) => resume.id !== resumeId)
      );
    } catch {
      alert("No se pudo eliminar el CV.");
    }
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

          <Link to="/resume/new" className="dashboard-page__create-btn">
            Crear Currículum
          </Link>
        </div>

        <div className="dashboard-page__stats">
          <div className="stat-card">
            <div className="stat-card__label">Total de Currículums</div>
            <div className="stat-card__value">
              {stats.totalResumes}
              <span className="stat-card__unit">documentos</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__label">Versiones Guardadas</div>
            <div className="stat-card__value">
              {stats.totalVersions}
              <span className="stat-card__unit">versiones</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__label">Última Actualización</div>
            <div className="stat-card__value stat-card__value--date">
              {resumes.length > 0
                ? formatDate(resumes[0].updatedAt || resumes[0].createdAt)
                : "Sin actividad"}
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

                    {/* ToDo: Try to change this dyamically according to the country */}
                    <span className="resume-card__date">
                      {formatDate(resume.createdAt)}
                    </span>
                  </div>

                  <h3 className="resume-card__title">
                    {resume.title}
                  </h3>

                  {/* ToDo: Add job-based description */}
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

                    <button
                      type="button"
                      onClick={() => handleDeleteResume(resume.id)}
                      className="resume-card__delete-btn"
                    >
                      Eliminar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadResume(resume.id, resume.title)}
                      className="resume-card__download-btn"
                    >
                      Descargar
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