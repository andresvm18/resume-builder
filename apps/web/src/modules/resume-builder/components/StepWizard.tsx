import type { Step, StepItem } from "../types/resume.types";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";
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

  const currentIndex = getStepIndex(currentStep);
  const progress = steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="resume-builder-page__wizard">
      <div className="resume-builder-page__progress">
        <div
          className="resume-builder-page__progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="resume-builder-page__steps">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = isStepCompleted(step.id);
          const stepNumber = getStepIndex(step.id) + 1;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick?.(step.id)}
              className={`resume-builder-page__step ${isActive ? "resume-builder-page__step--active" : ""
                } ${isCompleted ? "resume-builder-page__step--completed" : ""
                }`}
              aria-current={isActive ? "step" : undefined}
              aria-label={`${APP_MESSAGES.RESUME_BUILDER.WIZARD_STEP_ARIA} ${stepNumber}: ${step.label}`}
            >
              <div className="resume-builder-page__step-number">
                {isCompleted ? "✓" : stepNumber}
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