import { useMemo, useState } from "react";
import type { Experience } from "../../types/resume.types";
import { IconX } from "@tabler/icons-react";
import { APP_MESSAGES } from "../../../../shared/constants/appMessages";

const months = [
  { value: "01", label: APP_MESSAGES.MONTHS.JANUARY },
  { value: "02", label: APP_MESSAGES.MONTHS.FEBRUARY },
  { value: "03", label: APP_MESSAGES.MONTHS.MARCH },
  { value: "04", label: APP_MESSAGES.MONTHS.APRIL },
  { value: "05", label: APP_MESSAGES.MONTHS.MAY },
  { value: "06", label: APP_MESSAGES.MONTHS.JUNE },
  { value: "07", label: APP_MESSAGES.MONTHS.JULY },
  { value: "08", label: APP_MESSAGES.MONTHS.AUGUST },
  { value: "09", label: APP_MESSAGES.MONTHS.SEPTEMBER },
  { value: "10", label: APP_MESSAGES.MONTHS.OCTOBER },
  { value: "11", label: APP_MESSAGES.MONTHS.NOVEMBER },
  { value: "12", label: APP_MESSAGES.MONTHS.DECEMBER },
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
                {APP_MESSAGES.RESUME_BUILDER.EXPERIENCE_TITLE}
              </span>

              <button
                type="button"
                onClick={() => removeExperience(exp.id)}
                className="resume-builder-page__item-remove"
                aria-label={`${APP_MESSAGES.RESUME_BUILDER.REMOVE_EXPERIENCE_ARIA} ${exp.title || APP_MESSAGES.RESUME_BUILDER.WITHOUT_TITLE}`}
              >
                <IconX size={14} stroke={2} />
              </button>
            </div>

            <div className="resume-builder-page__item-fields">
              <input
                placeholder={APP_MESSAGES.RESUME_BUILDER.JOB_TITLE_PLACEHOLDER}
                value={exp.title}
                onChange={(e) =>
                  updateExperience(exp.id, "title", e.target.value)
                }
                className="resume-builder-page__input"
              />

              <input
                placeholder={APP_MESSAGES.RESUME_BUILDER.COMPANY_PLACEHOLDER}
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
                  <option value="">{APP_MESSAGES.RESUME_BUILDER.START_MONTH_PLACEHOLDER}</option>
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
                  <option value="">{APP_MESSAGES.RESUME_BUILDER.START_YEAR_PLACEHOLDER}</option>
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
                    <option value="">{APP_MESSAGES.RESUME_BUILDER.END_MONTH_PLACEHOLDER}</option>
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
                    <option value="">{APP_MESSAGES.RESUME_BUILDER.END_YEAR_PLACEHOLDER}</option>
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

                <span>{APP_MESSAGES.RESUME_BUILDER.CURRENTLY_WORKING_LABEL}</span>
              </label>

              <textarea
                rows={4}
                placeholder={APP_MESSAGES.RESUME_BUILDER.DESCRIPTION_PLACEHOLDER}
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
        {APP_MESSAGES.RESUME_BUILDER.ADD_EXPERIENCE_BUTTON}
      </button>
    </div>
  );
}