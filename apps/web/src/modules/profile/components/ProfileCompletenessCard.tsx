import type { ResumeData } from "../../resume-builder/types/resume.types";
import { calculateProfileCompleteness } from "../utils/profileCompleteness";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";

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
            {APP_MESSAGES.PROFILE.COMPLETENESS_EYEBROW}
          </p>

          <h3 className="profile-completeness__title">
            {`${result.percentage}${APP_MESSAGES.PROFILE.COMPLETENESS_PERCENTAGE}`}
          </h3>

          <p className="profile-completeness__subtitle">
            {result.isReadyForAi
              ? APP_MESSAGES.PROFILE.COMPLETENESS_READY
              : APP_MESSAGES.PROFILE.COMPLETENESS_NOT_READY}
          </p>
        </div>

        <span
          className={
            result.isReadyForAi
              ? "profile-completeness__badge profile-completeness__badge--ready"
              : "profile-completeness__badge"
          }
        >
          {result.isReadyForAi 
            ? APP_MESSAGES.PROFILE.BADGE_READY 
            : APP_MESSAGES.PROFILE.BADGE_INCOMPLETE}
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
            {APP_MESSAGES.PROFILE.SECTION_REQUIRED}
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
            {APP_MESSAGES.PROFILE.SECTION_OPTIONAL}
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