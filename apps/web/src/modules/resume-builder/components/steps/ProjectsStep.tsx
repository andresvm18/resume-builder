import type { Project } from "../../types/resume.types";
import { IconX } from "@tabler/icons-react";
import { APP_MESSAGES } from "../../../../shared/constants/appMessages";

type ProjectsStepProps = {
  projects: Project[];
  addProject: () => void;
  updateProject: (
    id: string | number,
    field: keyof Project,
    value: string
  ) => void;
  removeProject: (id: string | number) => void;
};

export default function ProjectsStep({
  projects,
  addProject,
  updateProject,
  removeProject,
}: ProjectsStepProps) {
  return (
    <div className="resume-builder-page__section">
      {projects.map((project) => (
        <div key={project.id} className="resume-builder-page__item-card">
          <div className="resume-builder-page__item-header">
            <span className="resume-builder-page__item-title">
              {APP_MESSAGES.RESUME_BUILDER.PROJECT_TITLE}
            </span>

            <button
              type="button"
              onClick={() => removeProject(project.id)}
              className="resume-builder-page__item-remove"
              aria-label={`${APP_MESSAGES.RESUME_BUILDER.REMOVE_PROJECT_ARIA} ${project.name || APP_MESSAGES.RESUME_BUILDER.WITHOUT_TITLE}`}
            >
              <IconX size={14} stroke={2} />
            </button>
          </div>

          <div className="resume-builder-page__item-fields">
            <input
              placeholder={APP_MESSAGES.RESUME_BUILDER.PROJECT_NAME_PLACEHOLDER}
              value={project.name}
              onChange={(e) =>
                updateProject(project.id, "name", e.target.value)
              }
              className="resume-builder-page__input"
            />

            <input
              placeholder={APP_MESSAGES.RESUME_BUILDER.PROJECT_TECHNOLOGIES_PLACEHOLDER}
              value={project.technologies}
              onChange={(e) =>
                updateProject(project.id, "technologies", e.target.value)
              }
              className="resume-builder-page__input"
            />

            <textarea
              rows={4}
              placeholder={APP_MESSAGES.RESUME_BUILDER.PROJECT_DESCRIPTION_PLACEHOLDER}
              value={project.description}
              onChange={(e) =>
                updateProject(project.id, "description", e.target.value)
              }
              className="resume-builder-page__textarea"
            />

            <input
              placeholder={APP_MESSAGES.RESUME_BUILDER.PROJECT_LINK_PLACEHOLDER}
              value={project.link}
              onChange={(e) =>
                updateProject(project.id, "link", e.target.value)
              }
              className="resume-builder-page__input"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addProject}
        className="resume-builder-page__add-btn"
      >
        {APP_MESSAGES.RESUME_BUILDER.ADD_PROJECT_BUTTON}
      </button>
    </div>
  );
}