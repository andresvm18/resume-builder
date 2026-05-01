type JobDescriptionStepProps = {
  jobDescription: string;
  setJobDescription: (value: string) => void;
};

export default function JobDescriptionStep({
  jobDescription,
  setJobDescription,
}: JobDescriptionStepProps) {
  return (
    <div className="resume-builder-page__section">
      <textarea
        rows={10}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Pega aquí la descripción de la oferta laboral para analizar palabras clave, requisitos y compatibilidad ATS..."
        className="resume-builder-page__textarea"
      />
    </div>
  );
}