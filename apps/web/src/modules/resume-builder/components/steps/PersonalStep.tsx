import { APP_MESSAGES } from "../../../../shared/constants/appMessages";

type PersonalStepProps = {
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
};

export default function PersonalStep({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  location,
  setLocation,
}: PersonalStepProps) {
  return (
    <div className="resume-builder-page__section">
      <div className="resume-builder-page__form-grid resume-builder-page__form-grid--2cols">
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={APP_MESSAGES.RESUME_BUILDER.FULL_NAME_PLACEHOLDER}
          className="resume-builder-page__input"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={APP_MESSAGES.RESUME_BUILDER.EMAIL_PLACEHOLDER}
          className="resume-builder-page__input"
        />

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={APP_MESSAGES.RESUME_BUILDER.PHONE_PLACEHOLDER}
          className="resume-builder-page__input"
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={APP_MESSAGES.RESUME_BUILDER.LOCATION_PLACEHOLDER}
          className="resume-builder-page__input"
        />
      </div>
    </div>
  );
}