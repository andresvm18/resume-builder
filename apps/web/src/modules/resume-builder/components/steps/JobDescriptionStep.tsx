import { APP_MESSAGES } from "../../../../shared/constants/appMessages";

type JobDescriptionStepProps = {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  targetRole: string;
  setTargetRole: (value: string) => void;
  targetCompany: string;
  setTargetCompany: (value: string) => void;
};

export default function JobDescriptionStep({
  jobDescription,
  setJobDescription,
  targetRole,
  setTargetRole,
  targetCompany,
  setTargetCompany,
}: JobDescriptionStepProps) {
  return (
    <div className="resume-builder-page__section">
      <div className="resume-builder-page__target-fields">
        <input
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder={APP_MESSAGES.RESUME_BUILDER.TARGET_ROLE_PLACEHOLDER}
          className="resume-builder-page__input"
        />

        <input
          value={targetCompany}
          onChange={(e) => setTargetCompany(e.target.value)}
          placeholder={APP_MESSAGES.RESUME_BUILDER.TARGET_COMPANY_PLACEHOLDER}
          className="resume-builder-page__input"
        />
      </div>

      <textarea
        rows={10}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder={APP_MESSAGES.RESUME_BUILDER.JOB_DESCRIPTION_PLACEHOLDER}
        className="resume-builder-page__textarea"
      />
    </div>
  );
}