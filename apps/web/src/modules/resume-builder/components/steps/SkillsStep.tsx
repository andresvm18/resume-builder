type SkillsStepProps = {
  skills: string[];
  skillInput: string;
  setSkillInput: (value: string) => void;
  addSkill: () => void;
  removeSkill: (index: number) => void;
};

export default function SkillsStep({
  skills,
  skillInput,
  setSkillInput,
  addSkill,
  removeSkill,
}: SkillsStepProps) {
  return (
    <div className="resume-builder-page__section">
      <div className="resume-builder-page__skill-input-group">
        <input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder="Escribe una habilidad"
          className="resume-builder-page__input"
        />

        <button
          type="button"
          onClick={addSkill}
          className="resume-builder-page__add-btn"
        >
          Agregar
        </button>
      </div>

      <div className="resume-builder-page__skills-list">
        {skills.map((skill, index) => (
          <div
            key={`${skill}-${index}`}
            className="resume-builder-page__skill-tag"
          >
            <span>{skill}</span>

            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="resume-builder-page__skill-remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}