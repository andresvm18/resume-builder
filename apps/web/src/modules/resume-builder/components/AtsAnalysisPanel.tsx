import { useEffect, useMemo, useState } from "react";
import {
  getAiRecommendations,
  type AiRecommendationsResponse,
} from "../services/ai.service";
import type { ResumeData } from "../types/resume.types";
import { analyzeResumeMatch } from "../utils/ats.utils";
import KeywordGroup from "./KeywordGroup";
import "./AtsAnalysisPanel.css";;

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

  // const displayedMatchedKeywords =
  //   aiResult?.matchedKeywords ?? fallbackResult.matchedKeywords;

  // const displayedMissingKeywords =
  //   aiResult?.missingKeywords ?? fallbackResult.missingKeywords;

  const displayedRecommendations = aiResult?.recommendations ?? [];

  const metrics = [
    {
      label: "Keyword Match",
      value: `${fallbackResult.matchPercentage}%`,
      description: "Coincidencia estimada de palabras clave",
    },
    {
      label: "Completitud",
      value: `${fallbackResult.sectionCompleteness}%`,
      description: "Secciones importantes del CV",
    },
    {
      label: "Formato",
      value: `${fallbackResult.formatQuality}%`,
      description: "Claridad y estructura del CV",
    },
    {
      label: "Alineación",
      value: `${fallbackResult.roleAlignment}%`,
      description: "Relación con el puesto",
    },
  ];

  return (
    <section className="ats-panel">
      <header className="ats-panel__header">
        <div>
          <h3 className="ats-panel__title">Análisis ATS</h3>
          <p className="ats-panel__description">
            Evaluación estimada de compatibilidad entre tu currículum y la oferta laboral.
          </p>
        </div>

        <div className="ats-panel__score-card">
          <span className="ats-panel__score">{fallbackResult.atsScore}%</span>
          <span className="ats-panel__score-label">Score ATS</span>
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
            Palabras clave analizadas por categoría
          </h4>

          <div className="ats-panel__keyword-groups">
            <KeywordGroup
              title="Técnicas / herramientas"
              keywords={aiResult.keywords.technical}
            />
            <KeywordGroup
              title="Habilidades blandas"
              keywords={aiResult.keywords.softSkills}
            />
            <KeywordGroup
              title="Certificaciones"
              keywords={aiResult.keywords.certifications}
            />
            <KeywordGroup
              title="Responsabilidades"
              keywords={aiResult.keywords.responsibilities}
            />
          </div>
        </div>
      )}

      {/* <div className="ats-panel__section">
        <div className="ats-panel__section-header">
          <h4 className="ats-panel__section-title">
            Palabras clave encontradas
          </h4>
          <span className="ats-panel__counter">
            {displayedMatchedKeywords.length}
          </span>
        </div>

        <div className="ats-panel__keywords">
          {displayedMatchedKeywords.length === 0 ? (
            <span className="ats-panel__empty">
              Aún no hay coincidencias detectadas.
            </span>
          ) : (
            displayedMatchedKeywords.map((word) => (
              <span
                key={word}
                className="ats-panel__tag ats-panel__tag--matched"
              >
                {word}
              </span>
            ))
          )}
        </div>
      </div> */}

      {/* <div className="ats-panel__section">
        <div className="ats-panel__section-header">
          <h4 className="ats-panel__section-title">
            Palabras clave faltantes
          </h4>
          <span className="ats-panel__counter">
            {displayedMissingKeywords.length}
          </span>
        </div>

        <div className="ats-panel__keywords">
          {displayedMissingKeywords.length === 0 ? (
            <span className="ats-panel__empty">
              No se detectaron palabras clave faltantes.
            </span>
          ) : (
            displayedMissingKeywords.map((word) => (
              <span
                key={word}
                className="ats-panel__tag ats-panel__tag--missing"
              >
                {word}
              </span>
            ))
          )}
        </div>
      </div> */}

      <div className="ats-panel__section">
        <h4 className="ats-panel__section-title">Recomendaciones</h4>

        {isLoadingAiRecommendations && (
          <p className="ats-panel__empty">
            Generando recomendaciones con IA...
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
              No se pudo generar la recomendación con IA. Mostrando recomendaciones básicas.
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
        Este score es una estimación heurística basada en coincidencia de palabras clave,
        estructura del currículum y alineación con la oferta. Las keywords y recomendaciones
        pueden ser generadas por IA cuando el servicio está disponible.
      </p>
    </section>
  );
}