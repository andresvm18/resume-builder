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
  if (!jobDescription.trim()) return null;

  const result = analyzeResumeMatch(resumeData, jobDescription);

  return (
    <div className="ats-panel">
      <h3 className="ats-panel__title">Análisis ATS</h3>

      <p className="ats-panel__subtitle">
        Coincidencia estimada con la oferta:
      </p>

      <div className="ats-panel__score">
        {result.atsScore}%
      </div>

      <p className="ats-panel__subtitle">
        Keyword Match: {result.matchPercentage}%
      </p>

      <p className="ats-panel__subtitle">
        Completitud: {result.sectionCompleteness}%
      </p>

      <p className="ats-panel__subtitle">
        Formato: {result.formatQuality}%
      </p>

      <p className="ats-panel__subtitle">
        Alineación: {result.roleAlignment}%
      </p>

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

      <p className="ats-panel__subtitle">
        Palabras clave faltantes:
      </p>

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

      <p className="ats-panel__disclaimer">
        Este score es una estimación heurística basada en coincidencia de palabras clave y no representa el resultado de una plataforma ATS real.
      </p>
    </div>
  );
}