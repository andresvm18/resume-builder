import type { Step, StepItem } from "../types/resume.types";
import "./StepWizard.css";

type StepWizardProps = {
  steps: StepItem[];
  currentStep: Step;
  isStepCompleted: (step: Step) => boolean;
  getStepIndex: (step: Step) => number;
  onStepClick?: (step: Step) => void;
};

export default function StepWizard({
  steps,
  currentStep,
  isStepCompleted,
  getStepIndex,
  onStepClick,
}: StepWizardProps) {
  return (
    <div className="resume-builder-page__wizard">
      <div className="resume-builder-page__steps">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = isStepCompleted(step.id);

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick?.(step.id)}
              className={`resume-builder-page__step ${
                isActive ? "resume-builder-page__step--active" : ""
              } ${
                isCompleted ? "resume-builder-page__step--completed" : ""
              }`}
            >
              <div className="resume-builder-page__step-number">
                {isCompleted ? "✓" : getStepIndex(step.id) + 1}
              </div>

              <span className="resume-builder-page__step-label">
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}