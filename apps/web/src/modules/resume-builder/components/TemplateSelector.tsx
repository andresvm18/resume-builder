import type { ResumeTemplate } from "../types/resume.types";

type Props = {
  template: ResumeTemplate;
  setTemplate: (template: ResumeTemplate) => void;
};

const templates: { id: ResumeTemplate; label: string; description: string }[] = [
  {
    id: "classic",
    label: "Clásico",
    description: "Diseño compatible con ATS con divisores de sección tradicionales.",
  },
  {
    id: "modern",
    label: "Moderno",
    description: "Encabezado centrado con acentos dorados y espaciado refinado.",
  },
  {
    id: "compact",
    label: "Compacto",
    description: "Diseño reducido para currículums extensos y contenido denso.",
  },
];

export default function TemplateSelector({ template, setTemplate }: Props) {
  return (
    <section className="resume-builder-page__template-selector">
      <h3 className="resume-builder-page__template-title">
        Plantilla del CV
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