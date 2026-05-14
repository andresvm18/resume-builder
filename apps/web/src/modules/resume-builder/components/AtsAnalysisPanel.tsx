import { useEffect, useMemo, useState } from "react";
import {
  getAiRecommendations,
  type AiRecommendationsResponse,
} from "../services/ai.service";
import type { ResumeData } from "../types/resume.types";
import { analyzeResumeMatch } from "../utils/ats.utils";
import KeywordGroup from "./KeywordGroup";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";
import "./AtsAnalysisPanel.css";

type Props = {
  jobDescription?: string;
  resumeData: ResumeData;
};

export default function AtsAnalysisPanel({
  jobDescription = "",
  resumeData,
}: Props) {
  const [aiResult, setAiResult] = useState<AiRecommendationsResponse | null>(
    null
  );
  const [isLoadingAiRecommendations, setIsLoadingAiRecommendations] =
    useState(false);
  const [aiFailed, setAiFailed] = useState(false);

  const fallbackResult = useMemo(() => {
    return analyzeResumeMatch(resumeData, jobDescription);
  }, [resumeData, jobDescription]);

  useEffect(() => {
    if (!jobDescription.trim()) return;
    if (aiResult || aiFailed) return;

    const loadAiRecommendations = async () => {
      try {
        setIsLoadingAiRecommendations(true);
        setAiFailed(false);
        setAiResult(null);

        const response = await getAiRecommendations(
          resumeData,
          jobDescription
        );

        setAiResult(response);
      } catch {
        setAiFailed(true);
        setAiResult(null);
      } finally {
        setIsLoadingAiRecommendations(false);
      }
    };

    loadAiRecommendations();
  }, [jobDescription, aiResult, aiFailed, resumeData]);

  if (!jobDescription.trim()) return null;

  const displayedRecommendations = aiResult?.recommendations ?? [];

  const metrics = [
    {
      label: APP_MESSAGES.ATS.KEYWORD_MATCH_LABEL,
      value: `${fallbackResult.matchPercentage}%`,
      description: APP_MESSAGES.ATS.KEYWORD_MATCH_DESCRIPTION,
    },
    {
      label: APP_MESSAGES.ATS.COMPLETENESS_LABEL,
      value: `${fallbackResult.sectionCompleteness}%`,
      description: APP_MESSAGES.ATS.COMPLETENESS_DESCRIPTION,
    },
    {
      label: APP_MESSAGES.ATS.FORMAT_LABEL,
      value: `${fallbackResult.formatQuality}%`,
      description: APP_MESSAGES.ATS.FORMAT_DESCRIPTION,
    },
    {
      label: APP_MESSAGES.ATS.ALIGNMENT_LABEL,
      value: `${fallbackResult.roleAlignment}%`,
      description: APP_MESSAGES.ATS.ALIGNMENT_DESCRIPTION,
    },
  ];

  return (
    <section className="ats-panel">
      <header className="ats-panel__header">
        <div>
          <h3 className="ats-panel__title">{APP_MESSAGES.ATS.ANALYSIS_TITLE}</h3>
          <p className="ats-panel__description">
            {APP_MESSAGES.ATS.ANALYSIS_DESCRIPTION}
          </p>
        </div>

        <div className="ats-panel__score-card">
          <span className="ats-panel__score">{fallbackResult.atsScore}%</span>
          <span className="ats-panel__score-label">{APP_MESSAGES.ATS.SCORE_LABEL}</span>
        </div>
      </header>

      <div className="ats-panel__metrics">
        {metrics.map((metric) => (
          <article key={metric.label} className="ats-panel__metric">
            <span className="ats-panel__metric-value">{metric.value}</span>
            <span className="ats-panel__metric-label">{metric.label}</span>
            <p className="ats-panel__metric-description">
              {metric.description}
            </p>
          </article>
        ))}
      </div>

      {aiResult && (
        <div className="ats-panel__section">
          <h4 className="ats-panel__section-title">
            {APP_MESSAGES.ATS.KEYWORDS_SECTION_TITLE}
          </h4>

          <div className="ats-panel__keyword-groups">
            <KeywordGroup
              title={APP_MESSAGES.ATS.KEYWORDS_TECHNICAL}
              keywords={aiResult.keywords.technical}
            />
            <KeywordGroup
              title={APP_MESSAGES.ATS.KEYWORDS_SOFT_SKILLS}
              keywords={aiResult.keywords.softSkills}
            />
            <KeywordGroup
              title={APP_MESSAGES.ATS.KEYWORDS_CERTIFICATIONS}
              keywords={aiResult.keywords.certifications}
            />
            <KeywordGroup
              title={APP_MESSAGES.ATS.KEYWORDS_RESPONSIBILITIES}
              keywords={aiResult.keywords.responsibilities}
            />
          </div>
        </div>
      )}

      <div className="ats-panel__section">
        <h4 className="ats-panel__section-title">{APP_MESSAGES.ATS.RECOMMENDATIONS_TITLE}</h4>

        {isLoadingAiRecommendations && (
          <p className="ats-panel__empty">
            {APP_MESSAGES.ATS.LOADING_RECOMMENDATIONS}
          </p>
        )}

        {!isLoadingAiRecommendations && displayedRecommendations.length > 0 && (
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

        {!isLoadingAiRecommendations && aiFailed && (
          <>
            <p className="ats-panel__empty">
              {APP_MESSAGES.ATS.RECOMMENDATIONS_FAILED}
            </p>

            <ul className="ats-panel__recommendations">
              {fallbackResult.recommendations.map((recommendation) => (
                <li
                  key={recommendation.message}
                  className={`ats-panel__recommendation ats-panel__recommendation--${recommendation.type}`}
                >
                  {recommendation.message}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <p className="ats-panel__disclaimer">
        {APP_MESSAGES.ATS.DISCLAIMER}
      </p>
    </section>
  );
}