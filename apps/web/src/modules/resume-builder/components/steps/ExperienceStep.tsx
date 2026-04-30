import type { Experience } from "../../types/resume.types";

type ExperienceStepProps = {
  experiences: Experience[];
  addExperience: () => void;
  updateExperience: (
    id: string | number,
    field: keyof Experience,
    value: string
  ) => void;
  removeExperience: (id: string | number) => void;
};

export default function ExperienceStep({
  experiences,
  addExperience,
  updateExperience,
  removeExperience,
}: ExperienceStepProps) {
  return (
    <div className="resume-builder-page__section">
      {experiences.map((exp) => (
        <div key={exp.id} className="resume-builder-page__item-card">
          <div className="resume-builder-page__item-header">
            <span className="resume-builder-page__item-title">
              Experiencia Laboral
            </span>

            <button
              type="button"
              onClick={() => removeExperience(exp.id)}
              className="resume-builder-page__item-remove"
            >
              ×
            </button>
          </div>

          <div className="resume-builder-page__item-fields">
            <input
              placeholder="Puesto"
              value={exp.title}
              onChange={(e) =>
                updateExperience(exp.id, "title", e.target.value)
              }
              className="resume-builder-page__input"
            />

            <input
              placeholder="Empresa / Ubicación"
              value={exp.location}
              onChange={(e) =>
                updateExperience(exp.id, "location", e.target.value)
              }
              className="resume-builder-page__input"
            />

            <input
              type="month"
              value={exp.startDate}
              onChange={(e) =>
                updateExperience(exp.id, "startDate", e.target.value)
              }
              className="resume-builder-page__input"
            />

            <input
              type="month"
              value={exp.endDate}
              onChange={(e) =>
                updateExperience(exp.id, "endDate", e.target.value)
              }
              className="resume-builder-page__input"
            />

            <textarea
              rows={4}
              placeholder="Descripción (cada punto en una nueva línea)"
              value={exp.description}
              onChange={(e) =>
                updateExperience(exp.id, "description", e.target.value)
              }
              className="resume-builder-page__textarea"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExperience}
        className="resume-builder-page__add-btn"
      >
        Agregar Experiencia
      </button>
    </div>
  );
}