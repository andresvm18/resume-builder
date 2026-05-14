import type { ResumeTemplate } from "../types/resume.types";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";

type Props = {
  template: ResumeTemplate;
  setTemplate: (template: ResumeTemplate) => void;
};

const templates: { id: ResumeTemplate; label: string; description: string }[] = [
  {
    id: "classic",
    label: APP_MESSAGES.RESUME_BUILDER.TEMPLATE_CLASSIC_LABEL,
    description: APP_MESSAGES.RESUME_BUILDER.TEMPLATE_CLASSIC_DESCRIPTION,
  },
  {
    id: "modern",
    label: APP_MESSAGES.RESUME_BUILDER.TEMPLATE_MODERN_LABEL,
    description: APP_MESSAGES.RESUME_BUILDER.TEMPLATE_MODERN_DESCRIPTION,
  },
  {
    id: "compact",
    label: APP_MESSAGES.RESUME_BUILDER.TEMPLATE_COMPACT_LABEL,
    description: APP_MESSAGES.RESUME_BUILDER.TEMPLATE_COMPACT_DESCRIPTION,
  },
];

export default function TemplateSelector({ template, setTemplate }: Props) {
  return (
    <section className="resume-builder-page__template-selector">
      <h3 className="resume-builder-page__template-title">
        {APP_MESSAGES.RESUME_BUILDER.TEMPLATE_TITLE}
      </h3>

      <div className="resume-builder-page__template-grid">
        {templates.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTemplate(item.id)}
            className={
              item.id === template
                ? "resume-builder-page__template-card resume-builder-page__template-card--active"
                : "resume-builder-page__template-card"
            }
          >
            <span className="resume-builder-page__template-label">
              {item.label}
            </span>

            <span className="resume-builder-page__template-description">
              {item.description}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}