import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchUserResumes,
  downloadResumeById,
  duplicateResumeById,
  deleteResumeById,
} from "../../resume-builder/services/resume.service";
import type { Resume } from "../../resume-builder/types/resume.types";
import Header from "../../../shared/components/layout/Header";
import "./DashboardPage.css";
import { useToast } from "../../../shared/context/useToast";
import SkeletonCard from "../../../shared/components/ui/SkeletonCard";

import {
  IconFileText,
  IconEdit,
  IconTrash,
  IconDownload,
  IconPlus,
  IconFilePlus,
  IconChevronDown,
  IconCopy,
  IconBriefcase,
  IconBuilding,
} from "@tabler/icons-react";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getLatestResumeData(resume: Resume) {
  return resume.versions?.[0]?.data as Partial<{
    targetRole: string;
    targetCompany: string;
  }> | undefined;
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "name">("recent");
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const { showToast } = useToast()

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

  const stats = {
    totalResumes: resumes.length,
    totalVersions,
  };

  const filteredResumes = resumes
    .filter((resume) =>
      resume.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }

      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();

      return sortBy === "recent" ? dateB - dateA : dateA - dateB;
    });


  const handleDownloadResume = async (resumeId: string, title: string) => {
    try {
      const blob = await downloadResumeById(resumeId);
      const url = URL.createObjectURL(blob);

      const fileName = `${title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "") || "cv"
        }.pdf`;

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch {
      showToast("No se pudo descargar el CV", "error");
    }
  };

  const handleDuplicateResume = async (resumeId: string) => {
    try {
      const duplicatedResume = await duplicateResumeById(resumeId);

      setResumes((prev) => [duplicatedResume, ...prev]);

      showToast("CV duplicado correctamente", "success");
    } catch {
      showToast("No se pudo duplicar el CV", "error");
    }
  };

  const openDeleteModal = (resume: Resume) => {
    setDeleteError("");
    setResumeToDelete(resume);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setResumeToDelete(null);
    setDeleteError("");
  };

  const confirmDeleteResume = async () => {
    if (!resumeToDelete) return;

    try {
      setIsDeleting(true);
      setDeleteError("");

      await deleteResumeById(resumeToDelete.id);

      setResumes((prev) =>
        prev.filter((resume) => resume.id !== resumeToDelete.id)
      );

      setResumeToDelete(null);
    } catch {
      setDeleteError("No se pudo eliminar el CV. Intentalo nuevamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!loading && resumes.length === 0) {
    return (
      <main className="dashboard-page">
        <Header />

        <div className="dashboard-page__orb-top"></div>
        <div className="dashboard-page__orb-bottom"></div>

        <div className="dashboard-page__content rb-fade-up">
          <div className="dashboard-page__welcome">
            <div className="dashboard-page__welcome-text">
              <h1 className="dashboard-page__greeting">Bienvenido de nuevo</h1>
              <p className="dashboard-page__subtext">
                Gestiona tus currículums y crea nuevas oportunidades.
              </p>
            </div>

            <Link to="/resume/new" className="dashboard-page__create-btn">
              <span>Crear Currículum</span>
              <IconPlus size={16} stroke={1.8} />
            </Link>
          </div>

          <div className="dashboard-page__stats">
            <div className="stat-card">
              <div className="stat-card__label">Total de Currículums</div>
              <div className="stat-card__value">
                0
                <span className="stat-card__unit">documentos</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card__label">Versiones Guardadas</div>
              <div className="stat-card__value">
                0
                <span className="stat-card__unit">versiones</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card__label">Última Actualización</div>
              <div className="stat-card__value stat-card__value--date">
                Sin actividad
              </div>
            </div>
          </div>

          {/* Empty State Mejorado */}
          <div className="empty-state">
            <div className="empty-state__icon">
              <IconFilePlus size={48} stroke={1.2} />
            </div>

            <h3 className="empty-state__title">
              Aún no tienes currículums
            </h3>

            <p className="empty-state__description">
              Comienza creando tu primer CV profesional en minutos.
              Podrás editarlo, descargarlo y administrar todas sus versiones.
            </p>

            <Link to="/resume/new" className="empty-state__btn">
              Nuevo Currículum
              <IconPlus size={18} stroke={1.8} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <Header />

      <div className="dashboard-page__orb-top"></div>
      <div className="dashboard-page__orb-bottom"></div>

      <div className="dashboard-page__content rb-fade-up">
        <div className="dashboard-page__welcome">
          <div className="dashboard-page__welcome-text">
            <h1 className="dashboard-page__greeting">Bienvenido de nuevo</h1>
            <p className="dashboard-page__subtext">
              Gestiona tus currículums y crea nuevas oportunidades.
            </p>
          </div>

          <Link to="/resume/new" className="dashboard-page__create-btn">
            <span>Crear Currículum</span>
            <IconPlus size={16} stroke={1.8} />
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

        <div className="dashboard-page__section-header">
          <h2 className="dashboard-page__section-title">Tus Currículums</h2>

          <div className="dashboard-page__filters">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por título..."
              className="dashboard-page__search"
            />

            <div className="dashboard-page__sort-wrapper">
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as "recent" | "oldest" | "name")
                }
                className="dashboard-page__sort"
              >
                <option value="recent">Más recientes</option>
                <option value="oldest">Más antiguos</option>
                <option value="name">Nombre A-Z</option>
              </select>

              <IconChevronDown
                size={16}
                stroke={1.8}
                className="dashboard-page__sort-icon"
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="dashboard-page__grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!loading && filteredResumes.length > 0 && (
          <div className="dashboard-page__grid">
            {filteredResumes.map((resume, index) => {
              const metadata = getLatestResumeData(resume);

              return (
                <div
                  key={resume.id}
                  className="resume-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="resume-card__content">
                    <div className="resume-card__header">
                      <span className="resume-card__badge">
                        <IconFileText size={14} stroke={1.8} />
                        CV guardado
                      </span>

                      <span className="resume-card__date">
                        {formatDate(resume.createdAt)}
                      </span>
                    </div>

                    <h3 className="resume-card__title">{resume.title}</h3>

                    {(metadata?.targetRole || metadata?.targetCompany) && (
                      <div className="resume-card__metadata">
                        {metadata?.targetRole && (
                          <span className="resume-card__metadata-item">
                            <IconBriefcase size={14} stroke={1.8} />
                            {metadata.targetRole}
                          </span>
                        )}

                        {metadata?.targetCompany && (
                          <span className="resume-card__metadata-item">
                            <IconBuilding size={14} stroke={1.8} />
                            {metadata.targetCompany}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="resume-card__description">
                      CV generado automáticamente
                    </p>

                    <div className="resume-card__actions">
                      <Link
                        to={`/resume-builder/${resume.id}`}
                        className="resume-card__edit-btn"
                      >
                        <IconEdit size={15} stroke={1.8} />
                        Editar
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDuplicateResume(resume.id)}
                        className="resume-card__duplicate-btn"
                      >
                        <IconCopy size={15} stroke={1.8} />
                        Duplicar
                      </button>

                      <button
                        type="button"
                        onClick={() => openDeleteModal(resume)}
                        className="resume-card__delete-btn"
                      >
                        <IconTrash size={15} stroke={1.8} />
                        Eliminar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDownloadResume(resume.id, resume.title)
                        }
                        className="resume-card__download-btn"
                      >
                        <IconDownload size={15} stroke={1.8} />
                        Descargar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && resumes.length > 0 && filteredResumes.length === 0 && (
          <div className="empty-state">
            <h3 className="empty-state__title">No encontramos resultados</h3>

            <p className="empty-state__description">
              No hay currículums que coincidan con tu búsqueda actual.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSortBy("recent");
              }}
              className="empty-state__btn"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {resumeToDelete && (
        <div
          className="dashboard-page__modal-backdrop"
          role="presentation"
          onClick={closeDeleteModal}
        >
          <div
            className="dashboard-page__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-resume-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="dashboard-page__modal-icon">!</div>

            <h3
              id="delete-resume-title"
              className="dashboard-page__modal-title"
            >
              Eliminar currículum
            </h3>

            <p className="dashboard-page__modal-description">
              ¿Estás seguro de que querés eliminar{" "}
              <strong>{resumeToDelete.title}</strong>? Esta acción no se puede
              deshacer.
            </p>

            {deleteError && (
              <p className="dashboard-page__modal-error">{deleteError}</p>
            )}

            <div className="dashboard-page__modal-actions">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="dashboard-page__modal-cancel"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmDeleteResume}
                disabled={isDeleting}
                className="dashboard-page__modal-confirm"
              >
                {isDeleting ? "Eliminando..." : "Eliminar CV"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}