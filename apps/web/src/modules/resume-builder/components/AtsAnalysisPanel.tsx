import "./AtsAnalysisPanel.css";
import { getTopKeywords } from "../utils/ats.utils";

type Props = {
  jobDescription?: string;
};

export default function AtsAnalysisPanel({ jobDescription = "" }: Props) {
  if (!jobDescription.trim()) return null;

  const keywords = getTopKeywords(jobDescription);

  return (
    <div className="ats-panel">
      <h3 className="ats-panel__title">Análisis ATS</h3>

      <p className="ats-panel__subtitle">
        Palabras clave detectadas en la oferta:
      </p>

      <div className="ats-panel__keywords">
        {keywords.length === 0 ? (
          <span>No se detectaron palabras clave</span>
        ) : (
          keywords.map((word) => (
            <span key={word} className="ats-panel__tag">
              {word}
            </span>
          ))
        )}
      </div>

      <p className="ats-panel__disclaimer">
        ⚠️ Los resultados se generan mediante análisis heurístico y pueden no
        ser 100% precisos. Úsalos como guía orientativa, no como evaluación
        definitiva.
      </p>
    </div>
  );
}