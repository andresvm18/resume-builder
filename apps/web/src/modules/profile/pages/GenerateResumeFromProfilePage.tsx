import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../../shared/components/layout/Header";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";

import { generateResumeFromProfile } from "../services/profile-ai.service";
import { getProfile } from "../services/profile.service";

export default function GenerateResumeFromProfilePage() {
  const navigate = useNavigate();

  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function validateProfile() {
      try {
        const response = await getProfile();
        const profile = response.profileData;

        const hasPersonalInfo =
          profile.fullName?.trim() &&
          profile.email?.trim();

        const hasEducation =
          Array.isArray(profile.education) &&
          profile.education.length > 0;

        const hasSkills =
          Array.isArray(profile.skills) &&
          profile.skills.length > 0;

        const hasMinimumProfile =
          hasPersonalInfo &&
          hasEducation &&
          hasSkills;

        setHasProfile(Boolean(hasMinimumProfile));
      } catch (error) {
        console.error(error);
        setHasProfile(false);
      }
    }

    void validateProfile();
  }, []);

  async function handleGenerate() {
    try {
      setIsGenerating(true);
      setError("");

      const response = await generateResumeFromProfile(
        jobDescription,
        "modern-template"
      );

      const resumeData = {
        ...response.resumeData,
        targetRole,
        targetCompany,
        jobDescription,
      };

      localStorage.setItem(
        "resume-profile-generated",
        JSON.stringify(resumeData)
      );

      navigate("/resume-builder");
    } catch (error) {
      console.error(error);
      setError(APP_MESSAGES.AI.GENERATION_ERROR);
    } finally {
      setIsGenerating(false);
    }
  }

  if (hasProfile === null) {
    return (
      <main className="profile-page">
        <Header />

        <div className="profile-page__container">
          <div className="profile-page__card">
            <p className="profile-page__description">
              {APP_MESSAGES.PROFILE.LOADING_PROFILE}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!hasProfile) {
    return (
      <main className="profile-page">
        <Header />

        <div className="profile-page__container">
          <div className="profile-page__card">
            <h1 className="profile-page__title">
              {APP_MESSAGES.PROFILE.COMPLETE_PROFILE_TITLE}
            </h1>

            <p className="profile-page__description">
              {APP_MESSAGES.PROFILE.COMPLETE_PROFILE_DESCRIPTION}
            </p>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="profile-page__save-btn"
              style={{ marginTop: "1rem" }}
            >
              {APP_MESSAGES.PROFILE.GO_TO_PROFILE_BUTTON}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <Header />

      <div className="profile-page__container">
        <div className="profile-page__card">
          <h1 className="profile-page__title">
            {APP_MESSAGES.PROFILE.GENERATE_CV_TITLE}
          </h1>

          <p className="profile-page__description">
            {APP_MESSAGES.PROFILE.GENERATE_CV_DESCRIPTION}
          </p>

          <div className="resume-builder-page__target-fields">
            <input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="resume-builder-page__input"
              placeholder={APP_MESSAGES.PROFILE.TARGET_ROLE_PLACEHOLDER}
            />

            <input
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="resume-builder-page__input"
              placeholder={APP_MESSAGES.PROFILE.TARGET_COMPANY_PLACEHOLDER}
            />
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="resume-builder-page__textarea"
            rows={12}
            placeholder={APP_MESSAGES.PROFILE.JOB_DESCRIPTION_PLACEHOLDER}
          />

          {error && (
            <p className="profile-page__error" style={{ marginTop: "1rem" }}>
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={
              isGenerating ||
              !jobDescription.trim() ||
              !targetRole.trim()
            }
            className="profile-page__save-btn"
            style={{ marginTop: "1rem" }}
          >
            {isGenerating
              ? APP_MESSAGES.PROFILE.GENERATING_BUTTON
              : APP_MESSAGES.PROFILE.GENERATE_BUTTON}
          </button>
        </div>
      </div>
    </main>
  );
}