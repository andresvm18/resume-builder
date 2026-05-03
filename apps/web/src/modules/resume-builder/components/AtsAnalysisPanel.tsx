import { useEffect, useMemo, useState } from "react";
import { getAiRecommendations } from "../services/ai.service";
import type { ResumeData } from "../types/resume.types";
import { analyzeResumeMatch } from "../utils/ats.utils";
import "./AtsAnalysisPanel.css";

type Props = {
  jobDescription?: string;
  resumeData: ResumeData;
};

export default function AtsAnalysisPanel({
  jobDescription = "",
  resumeData,
}: Props) {
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [isLoadingAiRecommendations, setIsLoadingAiRecommendations] =
    useState(false);
  const [aiFailed, setAiFailed] = useState(false);

  const result = useMemo(() => {
    return analyzeResumeMatch(resumeData, jobDescription);
  }, [resumeData, jobDescription]);

  useEffect(() => {
    if (!jobDescription.trim()) return;

    const loadAiRecommendations = async () => {
      try {
        setIsLoadingAiRecommendations(true);
        setAiFailed(false);
        setAiRecommendations([]);

        const response = await getAiRecommendations(
          resumeData,
          jobDescription,
          result
        );

        setAiRecommendations(response.recommendations);
      } catch {
        setAiFailed(true);
        setAiRecommendations([]);
      } finally {
        setIsLoadingAiRecommendations(false);
      }
    };

    loadAiRecommendations();
  }, [jobDescription, resumeData, result]);

  if (!jobDescription.trim()) return null;

  const metrics = [
    {
      label: "Keyword Match",
      value: `${result.matchPercentage}%`,
      description: "Coincidencia de palabras clave",
    },
    {
      label: "Completitud",
      value: `${result.sectionCompleteness}%`,
      description: "Secciones importantes del CV",
    },
    {
      label: "Formato",
      value: `${result.formatQuality}%`,
      description: "Claridad y estructura del CV",
    },
    {
      label: "Alineación",
      value: `${result.roleAlignment}%`,
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
          <span className="ats-panel__score">{result.atsScore}%</span>
          <span className="ats-panel__score-label">Score ATS</span>
        </div>
      </header>

      <div className="ats-panel__metrics">
        {metrics.map((metric) => (
          <article key={metric.label} className="ats-panel__metric">
            <span className="ats-panel__metric-value">{metric.value}</span>
            <span className="ats-panel__metric-label">{metric.label}</span>
            <p className="ats-panel__metric-description">{metric.description}</p>
          </article>
        ))}
      </div>

      <div className="ats-panel__section">
        <div className="ats-panel__section-header">
          <h4 className="ats-panel__section-title">Palabras clave encontradas</h4>
          <span className="ats-panel__counter">
            {result.matchedKeywords.length}
          </span>
        </div>

        <div className="ats-panel__keywords">
          {result.matchedKeywords.length === 0 ? (
            <span className="ats-panel__empty">
              Aún no hay coincidencias detectadas.
            </span>
          ) : (
            result.matchedKeywords.map((word) => (
              <span key={word} className="ats-panel__tag ats-panel__tag--matched">
                {word}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="ats-panel__section">
        <div className="ats-panel__section-header">
          <h4 className="ats-panel__section-title">Palabras clave faltantes</h4>
          <span className="ats-panel__counter">
            {result.missingKeywords.length}
          </span>
        </div>

        <div className="ats-panel__keywords">
          {result.missingKeywords.length === 0 ? (
            <span className="ats-panel__empty">
              No se detectaron palabras clave faltantes.
            </span>
          ) : (
            result.missingKeywords.map((word) => (
              <span key={word} className="ats-panel__tag ats-panel__tag--missing">
                {word}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="ats-panel__section">
        <h4 className="ats-panel__section-title">Recomendaciones IA</h4>

        {isLoadingAiRecommendations && (
          <p className="ats-panel__empty">
            Generando recomendaciones con IA...
          </p>
        )}

        {!isLoadingAiRecommendations && aiRecommendations.length > 0 && (
          <ul className="ats-panel__recommendations">
            {aiRecommendations.map((recommendation) => (
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
              {result.recommendations.map((recommendation) => (
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
        estructura del currículum y alineación con la oferta. No representa el resultado
        exacto de una plataforma ATS real.
      </p>
    </section>
  );
}