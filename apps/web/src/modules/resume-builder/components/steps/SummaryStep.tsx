import { APP_MESSAGES } from "../../../../shared/constants/appMessages";

type SummaryStepProps = {
  summary: string;
  setSummary: (value: string) => void;

  isOptimizingSummary: boolean;
  onOptimizeSummary: () => void;
};

export default function SummaryStep({
  summary,
  setSummary,
}: SummaryStepProps) {
  return (
    <div className="resume-builder-page__section">
      <textarea
        rows={8}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder={APP_MESSAGES.RESUME_BUILDER.SUMMARY_PLACEHOLDER}
        className="resume-builder-page__textarea"
      />
    </div>
  );
}