import type { Language } from "../../types/resume.types";

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
              Idioma
            </span>

            <button
              type="button"
              onClick={() => removeLanguage(lang.id)}
              className="resume-builder-page__item-remove"
            >
              ×
            </button>
          </div>

          <div className="resume-builder-page__item-fields">
            <input
              placeholder="Idioma"
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
              <option value="Basic">Básico</option>
              <option value="Intermediate">Intermedio</option>
              <option value="Advanced">Avanzado</option>
              <option value="Native">Nativo</option>
            </select>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addLanguage}
        className="resume-builder-page__add-btn"
      >
        Agregar Idioma
      </button>
    </div>
  );
}