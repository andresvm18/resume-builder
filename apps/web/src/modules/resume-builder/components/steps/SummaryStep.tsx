type SummaryStepProps = {
  summary: string;
  setSummary: (value: string) => void;

  isOptimizingSummary: boolean;
  onOptimizeSummary: () => void;
};

export default function SummaryStep({
  summary,
  setSummary,
  isOptimizingSummary,
  onOptimizeSummary,
}: SummaryStepProps) {
  return (
    <div className="resume-builder-page__section">
      <textarea
        rows={8}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Escribe un resumen profesional atractivo que destaque tu experiencia, habilidades y objetivos..."
        className="resume-builder-page__textarea"
      />

      <button
        type="button"
        onClick={onOptimizeSummary}
        disabled={isOptimizingSummary}
        className="resume-builder-page__ai-button"
      >
        {isOptimizingSummary ? (
          <>
            <span className="resume-builder-page__ai-button-spinner" />
            Optimizando...
          </>
        ) : (
          <>
            Optimizar con IA
            <span className="resume-builder-page__ai-button-icon">✨</span>
          </>
        )}
      </button>
    </div>
  );
}