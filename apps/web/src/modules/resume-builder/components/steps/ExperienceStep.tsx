import { useMemo, useState } from "react";
import type { Experience } from "../../types/resume.types";

const months = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const splitDate = (date: string) => {
  if (!date || date === "Present") return { year: "", month: "" };

  const [year = "", month = ""] = date.split("-");
  return { year, month };
};

const getDateKey = (id: string | number, field: "startDate" | "endDate") =>
  `${id}-${field}`;

type DateDraft = {
  month: string;
  year: string;
};

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
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearList: string[] = [];

    for (let year = currentYear; year >= 1980; year--) {
      yearList.push(year.toString());
    }

    return yearList;
  }, []);

  const [dateDrafts, setDateDrafts] = useState<Record<string, DateDraft>>({});

  const handleDateChange = (
    id: string | number,
    currentValue: string,
    field: "startDate" | "endDate",
    type: "month" | "year",
    value: string
  ) => {
    const key = getDateKey(id, field);
    const currentDraft = dateDrafts[key] ?? splitDate(currentValue);

    const newDraft = {
      ...currentDraft,
      [type]: value,
    };

    setDateDrafts((prev) => ({
      ...prev,
      [key]: newDraft,
    }));

    if (newDraft.month && newDraft.year) {
      updateExperience(id, field, `${newDraft.year}-${newDraft.month}`);
      return;
    }

    if (!newDraft.month && !newDraft.year) {
      updateExperience(id, field, "");
    }
  };

  const handleCurrentlyWorkingChange = (
    id: string | number,
    checked: boolean
  ) => {
    if (checked) {
      updateExperience(id, "endDate", "Present");

      setDateDrafts((prev) => ({
        ...prev,
        [getDateKey(id, "endDate")]: { month: "", year: "" },
      }));

      return;
    }

    updateExperience(id, "endDate", "");
  };

  return (
    <div className="resume-builder-page__section">
      {(experiences ?? []).map((exp) => {
        const startKey = getDateKey(exp.id, "startDate");
        const endKey = getDateKey(exp.id, "endDate");

        const start = dateDrafts[startKey] ?? splitDate(exp.startDate);
        const end = dateDrafts[endKey] ?? splitDate(exp.endDate);

        const currentlyWorking = exp.endDate === "Present";

        return (
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
                placeholder="Empresa"
                value={exp.location}
                onChange={(e) =>
                  updateExperience(exp.id, "location", e.target.value)
                }
                className="resume-builder-page__input"
              />

              <div className="resume-builder-page__form-grid resume-builder-page__form-grid--2cols">
                <select
                  value={start.month}
                  onChange={(e) =>
                    handleDateChange(
                      exp.id,
                      exp.startDate,
                      "startDate",
                      "month",
                      e.target.value
                    )
                  }
                  className={`resume-builder-page__select ${!start.month ? "resume-builder-page__select--placeholder" : ""
                    }`}
                >
                  <option value="">Mes de inicio</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>

                <select
                  value={start.year}
                  onChange={(e) =>
                    handleDateChange(
                      exp.id,
                      exp.startDate,
                      "startDate",
                      "year",
                      e.target.value
                    )
                  }
                  className={`resume-builder-page__select ${!start.year ? "resume-builder-page__select--placeholder" : ""
                    }`}
                >
                  <option value="">Año de inicio</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {!currentlyWorking && (
                <div className="resume-builder-page__form-grid resume-builder-page__form-grid--2cols">
                  <select
                    value={end.month}
                    onChange={(e) =>
                      handleDateChange(
                        exp.id,
                        exp.endDate,
                        "endDate",
                        "month",
                        e.target.value
                      )
                    }
                    className={`resume-builder-page__select ${!end.month ? "resume-builder-page__select--placeholder" : ""
                      }`}
                  >
                    <option value="">Mes de finalización</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={end.year}
                    onChange={(e) =>
                      handleDateChange(
                        exp.id,
                        exp.endDate,
                        "endDate",
                        "year",
                        e.target.value
                      )
                    }
                    className={`resume-builder-page__select ${!end.year ? "resume-builder-page__select--placeholder" : ""
                      }`}
                  >
                    <option value="">Año finalización</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <label className="resume-builder-page__checkbox-row">
                <input
                  type="checkbox"
                  checked={currentlyWorking}
                  onChange={(e) =>
                    handleCurrentlyWorkingChange(exp.id, e.target.checked)
                  }
                  className="resume-builder-page__checkbox"
                />

                <span>Actualmente trabajo aquí</span>
              </label>

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
        );
      })}

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