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
import { useAsyncAction } from "../../../shared/hooks/useAsyncAction";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";

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
      showToast(APP_MESSAGES.DASHBOARD.DOWNLOAD_FAILED);
    }
  };

  const duplicateResumeAction = useAsyncAction(
    duplicateResumeById,
    {
      successMessage:
        APP_MESSAGES.DASHBOARD.DUPLICATE_SUCCESS,

      showToast,

      onSuccess: (duplicatedResume) => {
        setResumes((prev) => [
          duplicatedResume,
          ...prev,
        ]);
      },
    }
  );

  const handleDuplicateResume = async (
    resumeId: string
  ) => {
    await duplicateResumeAction.execute(resumeId);
  };

  const openDeleteModal = (resume: Resume) => {
    setDeleteError("");
    setResumeToDelete(resume);
  };

  const closeDeleteModal = () => {
    if (deleteResumeAction.isLoading) return;

    setResumeToDelete(null);
    setDeleteError("");
  };

  const deleteResumeAction = useAsyncAction(
    deleteResumeById,
    {
      showToast,

      onSuccess: (_, deletedId) => {
        setResumes((prev) =>
          prev.filter(
            (resume) => resume.id !== deletedId
          )
        );

        setResumeToDelete(null);
      },
    }
  );

  const confirmDeleteResume = async () => {
    if (!resumeToDelete) return;

    const deleted = await deleteResumeAction.execute(
      resumeToDelete.id
    );

    if (!deleted) {
      setDeleteError(
        APP_MESSAGES.DASHBOARD.DELETE_FAILED
      );
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
              <h1 className="dashboard-page__greeting">{APP_MESSAGES.DASHBOARD.GREETING}</h1>
              <p className="dashboard-page__subtext">{APP_MESSAGES.DASHBOARD.SUBTEXT}</p>
            </div>

            <Link to="/resume/new" className="dashboard-page__create-btn">
              {APP_MESSAGES.DASHBOARD.CREATE_BUTTON}
              <IconPlus size={16} stroke={1.8} />
            </Link>
          </div>

          <div className="dashboard-page__stats">
            <div className="stat-card">
              <div className="stat-card__label">{APP_MESSAGES.DASHBOARD.STATS_TOTAL_RESUMES}</div>
              <div className="stat-card__value">
                0
                <span className="stat-card__unit">{APP_MESSAGES.DASHBOARD.STATS_DOCUMENTS_UNIT}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card__label">{APP_MESSAGES.DASHBOARD.STATS_TOTAL_VERSIONS}</div>
              <div className="stat-card__value">
                0
                <span className="stat-card__unit">{APP_MESSAGES.DASHBOARD.STATS_VERSIONS_UNIT}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card__label">{APP_MESSAGES.DASHBOARD.STATS_LAST_UPDATED}</div>
              <div className="stat-card__value stat-card__value--date">
                {APP_MESSAGES.DASHBOARD.STATS_NO_ACTIVITY}
              </div>
            </div>
          </div>

          <div className="empty-state">
            <div className="empty-state__icon">
              <IconFilePlus size={48} stroke={1.2} />
            </div>

            <h3 className="empty-state__title">{APP_MESSAGES.DASHBOARD.EMPTY_TITLE}</h3>

            <p className="empty-state__description">{APP_MESSAGES.DASHBOARD.EMPTY_DESCRIPTION}</p>

            <Link to="/resume/new" className="empty-state__btn">
              {APP_MESSAGES.DASHBOARD.EMPTY_BUTTON}
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
            <h1 className="dashboard-page__greeting">{APP_MESSAGES.DASHBOARD.GREETING}</h1>
            <p className="dashboard-page__subtext">{APP_MESSAGES.DASHBOARD.SUBTEXT}</p>
          </div>

          <Link to="/resume/new" className="dashboard-page__create-btn">
            <span>{APP_MESSAGES.DASHBOARD.CREATE_BUTTON}</span>
            <IconPlus size={16} stroke={1.8} />
          </Link>
        </div>

        <div className="dashboard-page__stats">
          <div className="stat-card">
            <div className="stat-card__label">{APP_MESSAGES.DASHBOARD.STATS_TOTAL_RESUMES}</div>
            <div className="stat-card__value">
              {stats.totalResumes}
              <span className="stat-card__unit">{APP_MESSAGES.DASHBOARD.STATS_DOCUMENTS_UNIT}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__label">{APP_MESSAGES.DASHBOARD.STATS_TOTAL_VERSIONS}</div>
            <div className="stat-card__value">
              {stats.totalVersions}
              <span className="stat-card__unit">{APP_MESSAGES.DASHBOARD.STATS_VERSIONS_UNIT}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__label">{APP_MESSAGES.DASHBOARD.STATS_LAST_UPDATED}</div>
            <div className="stat-card__value stat-card__value--date">
              {resumes.length > 0
                ? formatDate(resumes[0].updatedAt || resumes[0].createdAt)
                : APP_MESSAGES.DASHBOARD.STATS_NO_ACTIVITY}
            </div>
          </div>
        </div>

        <div className="dashboard-page__section-header">
          <h2 className="dashboard-page__section-title">{APP_MESSAGES.DASHBOARD.SECTION_TITLE}</h2>

          <div className="dashboard-page__filters">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={APP_MESSAGES.DASHBOARD.SEARCH_PLACEHOLDER}
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
                <option value="recent">{APP_MESSAGES.DASHBOARD.SORT_RECENT}</option>
                <option value="recent">{APP_MESSAGES.DASHBOARD.SORT_OLDEST}</option>
                <option value="recent">{APP_MESSAGES.DASHBOARD.SORT_NAME}</option>
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
                        {APP_MESSAGES.DASHBOARD.CARD_BADGE}
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

                    <p className="resume-card__description">{APP_MESSAGES.DASHBOARD.CARD_DESCRIPTION}</p>

                    <div className="resume-card__actions">
                      <Link
                        to={`/resume-builder/${resume.id}`}
                        className="resume-card__edit-btn"
                      >
                        <IconEdit size={15} stroke={1.8} />
                        {APP_MESSAGES.DASHBOARD.CARD_EDIT_BUTTON}
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDuplicateResume(resume.id)}
                        className="resume-card__duplicate-btn"
                      >
                        <IconCopy size={15} stroke={1.8} />
                        {APP_MESSAGES.DASHBOARD.CARD_DUPLICATE_BUTTON}
                      </button>

                      <button
                        type="button"
                        onClick={() => openDeleteModal(resume)}
                        className="resume-card__delete-btn"
                      >
                        <IconTrash size={15} stroke={1.8} />
                        {APP_MESSAGES.DASHBOARD.CARD_DELETE_BUTTON}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDownloadResume(resume.id, resume.title)
                        }
                        className="resume-card__download-btn"
                      >
                        <IconDownload size={15} stroke={1.8} />
                        {APP_MESSAGES.DASHBOARD.CARD_DOWNLOAD_BUTTON}
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
            <h3 className="empty-state__title">{APP_MESSAGES.DASHBOARD.EMPTY_RESULTS}</h3>

            <p className="empty-state__description"> {APP_MESSAGES.DASHBOARD.EMPTY_RESULTS_DESCRIPTION} </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSortBy("recent");
              }}
              className="empty-state__btn"
            >
              {APP_MESSAGES.DASHBOARD.CLEAR_FILTERS_BUTTON}
            </button>
          </div>
        )}
      </div>


      <ConfirmDialog
        isOpen={Boolean(resumeToDelete)}
        title={APP_MESSAGES.DASHBOARD.DELETE_TITLE}
        description={
          <>
            {APP_MESSAGES.DASHBOARD.DELETE_CONFIRM} {" "}
            <strong>{resumeToDelete?.title}</strong>? {APP_MESSAGES.DASHBOARD.DELETE_DESCRIPTION}
          </>
        }
        cancelLabel={APP_MESSAGES.MODAL.CANCEL}
        confirmLabel={
          deleteResumeAction.isLoading
            ? APP_MESSAGES.DASHBOARD.DELETING
            : APP_MESSAGES.DASHBOARD.DELETE_ACTION
        }
        isLoading={deleteResumeAction.isLoading}
        error={deleteError}
        onCancel={closeDeleteModal}
        onConfirm={confirmDeleteResume}
      />

    </main>
  );
}