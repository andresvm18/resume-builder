import { useMemo } from "react";
import type { Education } from "../../types/resume.types";
import { IconX } from "@tabler/icons-react";
import { APP_MESSAGES } from "../../../../shared/constants/appMessages";

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
            <span className="resume-builder-page__item-title">
              {APP_MESSAGES.RESUME_BUILDER.EDUCATION_TITLE}
            </span>

            <button
              type="button"
              onClick={() => removeEducation(edu.id)}
              className="resume-builder-page__item-remove"
              aria-label={`${APP_MESSAGES.RESUME_BUILDER.REMOVE_EDUCATION_ARIA} ${edu.degree || APP_MESSAGES.RESUME_BUILDER.WITHOUT_TITLE}`}
            >
              <IconX size={14} stroke={2} />
            </button>
          </div>

          <div className="resume-builder-page__item-fields">
            <input
              placeholder={APP_MESSAGES.RESUME_BUILDER.INSTITUTION_PLACEHOLDER}
              value={edu.institution}
              onChange={(e) =>
                updateEducation(edu.id, "institution", e.target.value)
              }
              className="resume-builder-page__input"
            />

            <input
              placeholder={APP_MESSAGES.RESUME_BUILDER.DEGREE_PLACEHOLDER}
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
              <option value="">
                {APP_MESSAGES.RESUME_BUILDER.GRADUATION_YEAR_PLACEHOLDER}
              </option>
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
        {APP_MESSAGES.RESUME_BUILDER.ADD_EDUCATION_BUTTON}
      </button>
    </div>
  );
}