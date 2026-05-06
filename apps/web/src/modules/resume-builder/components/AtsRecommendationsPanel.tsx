import type { AiRecommendationsResponse } from "../services/ai.service";
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
            Palabras clave analizadas por categoría
          </h4>

          <div className="ats-panel__keyword-groups">
            <KeywordGroup
              title="Técnicas / herramientas"
              keywords={recommendations.keywords.technical}
            />
            <KeywordGroup
              title="Habilidades blandas"
              keywords={recommendations.keywords.softSkills}
            />
            <KeywordGroup
              title="Certificaciones"
              keywords={recommendations.keywords.certifications}
            />
            <KeywordGroup
              title="Responsabilidades"
              keywords={recommendations.keywords.responsibilities}
            />
          </div>
        </div>
      )}

      <div className="ats-panel__section">
        <h4 className="ats-panel__section-title">Recomendaciones</h4>

        {isLoading && (
          <p className="ats-panel__empty">
            Generando recomendaciones con IA...
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
            Aún no hay recomendaciones generadas.
          </p>
        )}

        {!isLoading && hasError && (
          <p className="ats-panel__empty">
            No se pudieron generar recomendaciones con IA.
          </p>
        )}
      </div>
    </section>
  );
}

type KeywordGroupProps = {
  title: string;
  keywords: string[];
};

function KeywordGroup({ title, keywords }: KeywordGroupProps) {
  if (keywords.length === 0) return null;

  return (
    <div className="ats-panel__keyword-group">
      <span className="ats-panel__keyword-group-title">{title}</span>

      <div className="ats-panel__keywords">
        {keywords.map((keyword) => (
          <span key={keyword} className="ats-panel__tag">
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}