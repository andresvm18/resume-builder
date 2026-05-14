import type { Language } from "../../types/resume.types";
import { IconX } from "@tabler/icons-react";
import { APP_MESSAGES } from "../../../../shared/constants/appMessages";

type LanguagesStepProps = {
  languages: Language[];
  addLanguage: () => void;
  updateLanguage: (
    id: string | number,
    field: keyof Language,
    value: string
  ) => void;
  removeLanguage: (id: string | number) => void;
};

export default function LanguagesStep({
  languages,
  addLanguage,
  updateLanguage,
  removeLanguage,
}: LanguagesStepProps) {
  return (
    <div className="resume-builder-page__section">
      {languages.map((lang) => (
        <div key={lang.id} className="resume-builder-page__item-card">
          <div className="resume-builder-page__item-header">
            <span className="resume-builder-page__item-title">
              {APP_MESSAGES.RESUME_BUILDER.LANGUAGE_TITLE}
            </span>

            <button
              type="button"
              onClick={() => removeLanguage(lang.id)}
              className="resume-builder-page__item-remove"
              aria-label={`${APP_MESSAGES.RESUME_BUILDER.REMOVE_LANGUAGE_ARIA} ${lang.name || APP_MESSAGES.RESUME_BUILDER.WITHOUT_TITLE}`}
            >
              <IconX size={14} stroke={2} />
            </button>
          </div>

          <div className="resume-builder-page__item-fields">
            <input
              placeholder={APP_MESSAGES.RESUME_BUILDER.LANGUAGE_NAME_PLACEHOLDER}
              value={lang.name}
              onChange={(e) =>
                updateLanguage(lang.id, "name", e.target.value)
              }
              className="resume-builder-page__input"
            />

            <select
              value={lang.level}
              onChange={(e) =>
                updateLanguage(lang.id, "level", e.target.value)
              }
              className="resume-builder-page__input"
            >
              <option value="Basic">
                {APP_MESSAGES.RESUME_BUILDER.LANGUAGE_LEVEL_BASIC}
              </option>
              <option value="Intermediate">
                {APP_MESSAGES.RESUME_BUILDER.LANGUAGE_LEVEL_INTERMEDIATE}
              </option>
              <option value="Advanced">
                {APP_MESSAGES.RESUME_BUILDER.LANGUAGE_LEVEL_ADVANCED}
              </option>
              <option value="Native">
                {APP_MESSAGES.RESUME_BUILDER.LANGUAGE_LEVEL_NATIVE}
              </option>
            </select>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addLanguage}
        className="resume-builder-page__add-btn"
      >
        {APP_MESSAGES.RESUME_BUILDER.ADD_LANGUAGE_BUTTON}
      </button>
    </div>
  );
}