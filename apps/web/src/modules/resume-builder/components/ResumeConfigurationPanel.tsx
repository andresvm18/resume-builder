import type {
  ResumeLanguage,
  ResumeTemplate,
} from "../types/resume.types";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";
import "./ResumeConfigurationPanel.css";

type Props = {
  template: ResumeTemplate;
  language: ResumeLanguage;
  setTemplate: (template: ResumeTemplate) => void;
  setLanguage: (language: ResumeLanguage) => void;
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

const languages: {
  id: ResumeLanguage;
  label: string;
  description: string;
}[] = [
  {
    id: "es",
    label: "Español",
    description: "CV profesional en español.",
  },
  {
    id: "en",
    label: "English",
    description: "Professional resume in English.",
  },
];

export default function ResumeConfigurationPanel({
  template,
  language,
  setTemplate,
  setLanguage,
}: Props) {
  return (
    <section className="resume-configuration">
      <div className="resume-configuration__content">
        <div className="resume-configuration__header">
          <p className="resume-configuration__eyebrow">Configuración</p>

          <h2 className="resume-configuration__title">
            Personaliza tu CV
          </h2>

          <p className="resume-configuration__description">
            Elegí el diseño y el idioma antes de generar tu currículum.
          </p>
        </div>

        <div className="resume-configuration__section">
          <h3 className="resume-configuration__section-title">
            Plantilla
          </h3>

          <div className="resume-configuration__template-grid">
            {templates.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTemplate(item.id)}
                className={
                  item.id === template
                    ? "resume-configuration__template-card resume-configuration__template-card--active"
                    : "resume-configuration__template-card"
                }
              >
                <MiniTemplatePreview template={item.id} />

                <span className="resume-configuration__template-label">
                  {item.label}
                </span>

                <span className="resume-configuration__template-description">
                  {item.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="resume-configuration__section">
          <h3 className="resume-configuration__section-title">
            Idioma del CV
          </h3>

          <div className="resume-configuration__language-grid">
            {languages.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLanguage(item.id)}
                className={
                  item.id === language
                    ? "resume-configuration__language-card resume-configuration__language-card--active"
                    : "resume-configuration__language-card"
                }
              >
                <span>{item.label}</span>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="resume-configuration__preview-panel">
        <p className="resume-configuration__preview-label">
          Vista previa
        </p>

        <ResumeTemplatePreview template={template} language={language} />
      </div>
    </section>
  );
}

type MiniTemplatePreviewProps = {
  template: ResumeTemplate;
};

function MiniTemplatePreview({ template }: MiniTemplatePreviewProps) {
  return (
    <div
      className={`mini-template mini-template--${template}`}
      aria-hidden="true"
    >
      <div className="mini-template__header" />
      <div className="mini-template__line mini-template__line--long" />
      <div className="mini-template__line" />
      <div className="mini-template__section" />
      <div className="mini-template__line mini-template__line--long" />
      <div className="mini-template__line" />
    </div>
  );
}

type ResumeTemplatePreviewProps = {
  template: ResumeTemplate;
  language: ResumeLanguage;
};

function ResumeTemplatePreview({
  template,
  language,
}: ResumeTemplatePreviewProps) {
  const copy = {
    es: {
      name: "Nombre Apellido",
      contact: "correo@email.com  |  +50600000000  |  San José, Costa Rica",
      summary: "PERFIL PROFESIONAL",
      education: "EDUCACIÓN",
      experience: "EXPERIENCIA LABORAL",
      skills: "HABILIDADES",
      languages: "IDIOMAS",
      projects: "PROYECTOS",
    },
    en: {
      name: "First Last",
      contact: "email@example.com  |  +10000000000  |  City, Country",
      summary: "PROFESSIONAL PROFILE",
      education: "EDUCATION",
      experience: "EXPERIENCE",
      skills: "SKILLS",
      languages: "LANGUAGES",
      projects: "PROJECTS",
    },
  }[language];

  return (
    <article
      className={`resume-template-preview resume-template-preview--${template}`}
    >
      <header className="resume-template-preview__header">
        <h3>{copy.name}</h3>
        <p>{copy.contact}</p>
      </header>

      <PreviewSection title={copy.summary} lines={3} />
      <PreviewSection title={copy.education} lines={2} />
      <PreviewSection title={copy.experience} lines={4} />
      <PreviewSection title={copy.skills} lines={3} />

      {template !== "compact" && (
        <>
          <PreviewSection title={copy.languages} lines={2} />
          <PreviewSection title={copy.projects} lines={2} />
        </>
      )}
    </article>
  );
}

function PreviewSection({
  title,
  lines,
}: {
  title: string;
  lines: number;
}) {
  return (
    <section className="resume-template-preview__section">
      <h4>{title}</h4>

      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={
            index === 0
              ? "resume-template-preview__line resume-template-preview__line--long"
              : "resume-template-preview__line"
          }
        />
      ))}
    </section>
  );
}