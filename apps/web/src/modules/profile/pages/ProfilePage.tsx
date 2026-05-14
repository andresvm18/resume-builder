import { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../../shared/components/layout/Header";
import ResumeFormPanel from "../../resume-builder/components/ResumeFormPanel";
import ProfileCompletenessCard from "../components/ProfileCompletenessCard";
import { useResumeBuilder } from "../../resume-builder/hooks/useResumeBuilder";
import { getProfile, updateProfile } from "../services/profile.service";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";

import {
  IconUser,
  IconFileText,
  IconTools,
  IconBriefcase,
  IconSchool,
  IconLanguage,
  IconRocket,
} from "@tabler/icons-react";

import "./ProfilePage.css";

const profileSteps = [
  { id: "personal", label: APP_MESSAGES.PROFILE.STEP_PERSONAL, icon: IconUser },
  { id: "summary", label: APP_MESSAGES.PROFILE.STEP_SUMMARY, icon: IconFileText },
  { id: "skills", label: APP_MESSAGES.PROFILE.STEP_SKILLS, icon: IconTools },
  { id: "experience", label: APP_MESSAGES.PROFILE.STEP_EXPERIENCE, icon: IconBriefcase },
  { id: "education", label: APP_MESSAGES.PROFILE.STEP_EDUCATION, icon: IconSchool },
  { id: "languages", label: APP_MESSAGES.PROFILE.STEP_LANGUAGES, icon: IconLanguage },
  { id: "projects", label: APP_MESSAGES.PROFILE.STEP_PROJECTS, icon: IconRocket },
] as const;

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const builder = useResumeBuilder();
  const setProfileData = builder.setResumeData;

  const latestResumeDataRef = useRef(builder.resumeData);
  const isSaving = saveStatus === "saving";

  useEffect(() => {
    latestResumeDataRef.current = builder.resumeData;
  }, [builder.resumeData]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await getProfile();

        setProfileData(response.profileData);
        latestResumeDataRef.current = response.profileData;

        setHasUnsavedChanges(false);
        setSaveStatus("saved");
      } catch (error) {
        console.error("Error loading profile:", error);
        setSaveStatus("error");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, [setProfileData]);

  const saveProfile = useCallback(async () => {
    if (saveStatus === "saving") return;

    setSaveStatus("saving");

    try {
      await updateProfile(latestResumeDataRef.current);

      setSaveStatus("saved");
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
    } catch (error) {
      console.error("Error saving profile:", error);

      setSaveStatus("error");
      setHasUnsavedChanges(false);
    }
  }, [saveStatus]);

  const handleSaveProfile = async () => {
    await saveProfile();
  };

  useEffect(() => {
    if (!hasUnsavedChanges || isLoading || isSaving) return;

    const timeoutId = window.setTimeout(() => {
      void saveProfile();
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [hasUnsavedChanges, isLoading, isSaving, saveProfile]);

  if (isLoading) {
    return (
      <main className="profile-page">
        <Header />
        <p style={{ padding: "2rem" }}>{APP_MESSAGES.PROFILE_PAGE.LOADING}</p>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <Header />

      <div className="profile-page__container">
        <div className="profile-page__card rb-fade-up">
          <div className="profile-page__header">
            <div>
              <h1 className="profile-page__title">{APP_MESSAGES.PROFILE_PAGE.TITLE}</h1>

              <p className="profile-page__description">
                {APP_MESSAGES.PROFILE_PAGE.DESCRIPTION}
              </p>

              <div
                className={`profile-page__save-status profile-page__save-status--${saveStatus}`}
              >
                {saveStatus === "saving" && (
                  <>
                    <span className="profile-page__spinner" />
                    {APP_MESSAGES.PROFILE_PAGE.SAVING}
                  </>
                )}

                {saveStatus === "saved" && lastSavedAt && (
                  <>
                    {APP_MESSAGES.PROFILE.SAVE_STATUS_SAVED_AT}
                    {lastSavedAt.toLocaleTimeString("es-CR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </>
                )}

                {saveStatus === "saved" && !lastSavedAt && APP_MESSAGES.PROFILE_PAGE.LOADED}

                {saveStatus === "error" && APP_MESSAGES.PROFILE_PAGE.SAVE_ERROR}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving || !hasUnsavedChanges}
              className="profile-page__save-btn"
            >
              {isSaving
                ? APP_MESSAGES.PROFILE_PAGE.SAVE_BUTTON_LOADING
                : hasUnsavedChanges
                  ? APP_MESSAGES.PROFILE_PAGE.SAVE_BUTTON_DIRTY
                  : APP_MESSAGES.PROFILE_PAGE.SAVE_BUTTON_SAVED}
            </button>
          </div>

          <ProfileCompletenessCard profile={builder.resumeData} />

          <div className="profile-page__tabs">
            {profileSteps.map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => builder.setCurrentStep(step.id as never)}
                className={
                  builder.currentStep === step.id
                    ? "profile-page__tab profile-page__tab--active"
                    : "profile-page__tab"
                }
              >
                <span>{step.label}</span>
                <step.icon
                  size={18}
                  stroke={1.8}
                  className="profile-page__tab-icon"
                />
              </button>
            ))}
          </div>

          <div
            onChange={() => {
              if (saveStatus === "saving") return;

              setHasUnsavedChanges(true);
              setSaveStatus("idle");
            }}
            className="profile-page__form-shell"
          >
            <ResumeFormPanel
              currentStep={builder.currentStep}
              fullName={builder.fullName}
              setFullName={builder.setFullName}
              email={builder.email}
              setEmail={builder.setEmail}
              phone={builder.phone}
              setPhone={builder.setPhone}
              location={builder.location}
              setLocation={builder.setLocation}
              summary={builder.summary}
              setSummary={builder.setSummary}
              experiences={builder.experiences}
              addExperience={builder.addExperience}
              updateExperience={builder.updateExperience}
              removeExperience={builder.removeExperience}
              education={builder.education}
              addEducation={builder.addEducation}
              updateEducation={builder.updateEducation}
              removeEducation={builder.removeEducation}
              skills={builder.skills}
              skillInput={builder.skillInput}
              setSkillInput={builder.setSkillInput}
              addSkill={builder.addSkill}
              removeSkill={builder.removeSkill}
              languages={builder.languages}
              addLanguage={builder.addLanguage}
              updateLanguage={builder.updateLanguage}
              removeLanguage={builder.removeLanguage}
              projects={builder.projects}
              addProject={builder.addProject}
              updateProject={builder.updateProject}
              removeProject={builder.removeProject}
              jobDescription={builder.jobDescription}
              setJobDescription={builder.setJobDescription}
              targetRole={builder.targetRole}
              setTargetRole={builder.setTargetRole}
              targetCompany={builder.targetCompany}
              setTargetCompany={builder.setTargetCompany}
              isOptimizingSummary={false}
              onOptimizeSummary={() => { }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}