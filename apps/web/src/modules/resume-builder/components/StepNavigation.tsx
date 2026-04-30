import "./StepNavigation.css";

type StepNavigationProps = {
  currentIndex: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
  disableNext?: boolean;
};

export default function StepNavigation({
  currentIndex,
  totalSteps,
  onPrev,
  onNext,
  onFinish,
  disableNext = false,
}: StepNavigationProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSteps - 1;

  return (
    <div className="resume-builder-page__navigation">
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        className="resume-builder-page__nav-btn resume-builder-page__nav-btn--prev"
      >
        Anterior
      </button>

      {!isLast ? (
        <button
          type="button"
          onClick={onNext}
          disabled={disableNext}
          className="resume-builder-page__nav-btn resume-builder-page__nav-btn--next"
        >
          Siguiente
        </button>
      ) : (
        <button
          type="button"
          onClick={onFinish}
          className="resume-builder-page__nav-btn resume-builder-page__nav-btn--finish"
        >
          ¡Listo! Generar CV
        </button>
      )}
    </div>
  );
}