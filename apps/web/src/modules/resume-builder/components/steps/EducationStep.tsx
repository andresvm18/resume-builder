import type { Education } from "../../types/resume.types";

type EducationStepProps = {
  education: Education[];
  addEducation: () => void;
  updateEducation: (
    id: string | number,
    field: keyof Education,
    value: string
  ) => void;
  removeEducation: (id: string | number) => void;
};

export default function EducationStep({
  education,
  addEducation,
  updateEducation,
  removeEducation,
}: EducationStepProps) {
  return (
    <div className="resume-builder-page__section">
      {education.map((edu) => (
        <div key={edu.id} className="resume-builder-page__item-card">
          <div className="resume-builder-page__item-header">
            <span className="resume-builder-page__item-title">
              Educación
            </span>

            <button
              type="button"
              onClick={() => removeEducation(edu.id)}
              className="resume-builder-page__item-remove"
            >
              ×
            </button>
          </div>

          <div className="resume-builder-page__item-fields">
            <input
              placeholder="Institución"
              value={edu.institution}
              onChange={(e) =>
                updateEducation(edu.id, "institution", e.target.value)
              }
              className="resume-builder-page__input"
            />

            <input
              placeholder="Título / Grado"
              value={edu.degree}
              onChange={(e) =>
                updateEducation(edu.id, "degree", e.target.value)
              }
              className="resume-builder-page__input"
            />

            <input
              type="month"
              value={edu.date}
              onChange={(e) =>
                updateEducation(edu.id, "date", e.target.value)
              }
              className="resume-builder-page__input"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="resume-builder-page__add-btn"
      >
        Agregar Educación
      </button>
    </div>
  );
}