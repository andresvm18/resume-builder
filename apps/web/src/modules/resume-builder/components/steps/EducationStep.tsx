import { useMemo } from "react";
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
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearList: string[] = [];

    for (let year = currentYear + 8; year >= 1980; year--) {
      yearList.push(year.toString());
    }

    return yearList;
  }, []);

  return (
    <div className="resume-builder-page__section">
      {education.map((edu) => (
        <div key={edu.id} className="resume-builder-page__item-card">
          <div className="resume-builder-page__item-header">
            <span className="resume-builder-page__item-title">Educación</span>

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

            <select
              value={edu.date}
              onChange={(e) => updateEducation(edu.id, "date", e.target.value)}
              className={`resume-builder-page__select ${!edu.date ? "resume-builder-page__select--placeholder" : ""
                }`}
            >
              <option value="">Año de finalización (o estimado)</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
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