import { useEffect, useState } from "react";
import Header from "../../../shared/components/layout/Header";
import ResumeFormPanel from "../../resume-builder/components/ResumeFormPanel";
import { useResumeBuilder } from "../../resume-builder/hooks/useResumeBuilder";
import {
  getProfile,
  updateProfile,
} from "../services/profile.service";

import "./ProfilePage.css";

const profileSteps = [
  { id: "personal", label: "Personal", icon: "👤" },
  { id: "summary", label: "Resumen", icon: "📝" },
  { id: "skills", label: "Habilidades", icon: "⚙️" },
  { id: "experience", label: "Experiencia", icon: "💼" },
  { id: "education", label: "Educación", icon: "🎓" },
  { id: "languages", label: "Idiomas", icon: "🌐" },
  { id: "projects", label: "Proyectos", icon: "🚀" },
] as const;

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const builder = useResumeBuilder();
  const setProfileData = builder.setResumeData;

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await getProfile();

        setProfileData(response.profileData);
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, [setProfileData]);

  async function handleSaveProfile() {
    setIsSaving(true);
    setSuccessMessage("");

    try {
      await updateProfile(builder.resumeData);
      setHasUnsavedChanges(false);
      setSuccessMessage("Perfil actualizado correctamente.");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <main className="profile-page">
        <Header />
        <p style={{ padding: "2rem" }}>Cargando perfil...</p>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <Header />

      <div className="profile-page__container">
        <div className="profile-page__card">
          <div className="profile-page__header">
            <div>
              <h1 className="profile-page__title">
                Perfil profesional
              </h1>

              <p className="profile-page__description">
                Guarda toda tu información profesional para reutilizarla
                automáticamente en futuros currículums.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving || !hasUnsavedChanges}
              className="profile-page__save-btn"
            >
              {isSaving ? "Guardando..." : hasUnsavedChanges ? "Guardar cambios" : "Guardado"}
            </button>
          </div>

          {successMessage && (
            <p className="profile-page__success">
              {successMessage}
            </p>
          )}

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
                <span>{step.icon}</span>
              </button>
            ))}
          </div>

          <div
            onChange={() => setHasUnsavedChanges(true)}
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
              isOptimizingSummary={false}
              onOptimizeSummary={() => { }}
            />
          </div>
        </div>
      </div>
    </main >
  );
}