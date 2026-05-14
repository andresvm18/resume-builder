import type { AiRecommendationsResponse } from "../services/ai.service";
import KeywordGroup from "./KeywordGroup";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";
import "./AtsAnalysisPanel.css";

type Props = {
  recommendations: AiRecommendationsResponse | null;
  isLoading?: boolean;
  hasError?: boolean;
};

export default function AtsRecommendationsPanel({
  recommendations,
  isLoading = false,
  hasError = false,
}: Props) {
  const displayedRecommendations = recommendations?.recommendations ?? [];

  return (
    <section className="ats-panel">
      {recommendations && (
        <div className="ats-panel__section">
          <h4 className="ats-panel__section-title">
            {APP_MESSAGES.ATS.KEYWORDS_SECTION_TITLE}
          </h4>

          <div className="ats-panel__keyword-groups">
            <KeywordGroup
              title={APP_MESSAGES.ATS.KEYWORDS_TECHNICAL}
              keywords={recommendations.keywords.technical}
            />
            <KeywordGroup
              title={APP_MESSAGES.ATS.KEYWORDS_SOFT_SKILLS}
              keywords={recommendations.keywords.softSkills}
            />
            <KeywordGroup
              title={APP_MESSAGES.ATS.KEYWORDS_CERTIFICATIONS}
              keywords={recommendations.keywords.certifications}
            />
            <KeywordGroup
              title={APP_MESSAGES.ATS.KEYWORDS_RESPONSIBILITIES}
              keywords={recommendations.keywords.responsibilities}
            />
          </div>
        </div>
      )}

      <div className="ats-panel__section">
        <h4 className="ats-panel__section-title">{APP_MESSAGES.ATS.RECOMMENDATIONS_TITLE}</h4>

        {isLoading && (
          <p className="ats-panel__empty">
            {APP_MESSAGES.ATS.LOADING_RECOMMENDATIONS}
          </p>
        )}

        {!isLoading && displayedRecommendations.length > 0 && (
          <ul className="ats-panel__recommendations">
            {displayedRecommendations.map((recommendation) => (
              <li
                key={recommendation}
                className="ats-panel__recommendation ats-panel__recommendation--alignment"
              >
                {recommendation}
              </li>
            ))}
          </ul>
        )}

        {!isLoading && !hasError && displayedRecommendations.length === 0 && (
          <p className="ats-panel__empty">
            {APP_MESSAGES.ATS.NO_RECOMMENDATIONS}
          </p>
        )}

        {!isLoading && hasError && (
          <p className="ats-panel__empty">
            {APP_MESSAGES.ATS.RECOMMENDATIONS_FAILED}
          </p>
        )}
      </div>
    </section>
  );
}