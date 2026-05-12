import type { ResumeData } from "../../resume-builder/types/resume.types";
import { calculateProfileCompleteness } from "../utils/profileCompleteness";

type Props = {
  profile: ResumeData;
};

export default function ProfileCompletenessCard({ profile }: Props) {
  const result = calculateProfileCompleteness(profile);

  return (
    <section className="profile-completeness">
      <div className="profile-completeness__header">
        <div>
          <p className="profile-completeness__eyebrow">
            Estado del perfil
          </p>

          <h3 className="profile-completeness__title">
            {result.percentage}% completado
          </h3>

          <p className="profile-completeness__subtitle">
            {result.isReadyForAi
              ? "Tu perfil ya tiene la información mínima para generar CVs con IA."
              : "Completa la información requerida para generar CVs con IA."}
          </p>
        </div>

        <span
          className={
            result.isReadyForAi
              ? "profile-completeness__badge profile-completeness__badge--ready"
              : "profile-completeness__badge"
          }
        >
          {result.isReadyForAi ? "Listo para IA" : "Incompleto"}
        </span>
      </div>

      <div className="profile-completeness__bar">
        <div
          className="profile-completeness__progress"
          style={{ width: `${result.percentage}%` }}
        />
      </div>

      <div className="profile-completeness__grid">
        <div>
          <h4 className="profile-completeness__section-title">
            Requerido
          </h4>

          <div className="profile-completeness__items">
            {result.completedRequired.map((item) => (
              <span
                key={item}
                className="profile-completeness__item profile-completeness__item--done"
              >
                ✓ {item}
              </span>
            ))}

            {result.missingRequired.map((item) => (
              <span
                key={item}
                className="profile-completeness__item profile-completeness__item--missing"
              >
                ○ {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="profile-completeness__section-title">
            Opcional
          </h4>

          <div className="profile-completeness__items">
            {result.completedOptional.map((item) => (
              <span
                key={item}
                className="profile-completeness__item profile-completeness__item--done"
              >
                ✓ {item}
              </span>
            ))}

            {result.missingOptional.map((item) => (
              <span
                key={item}
                className="profile-completeness__item"
              >
                ○ {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}