import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../../shared/components/layout/Header";

import { generateResumeFromProfile } from "../services/profile-ai.service";
import { getProfile } from "../services/profile.service";

export default function GenerateResumeFromProfilePage() {
  const navigate = useNavigate();

  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

      const response = await generateResumeFromProfile(
        jobDescription,
        "modern-template"
      );

      localStorage.setItem(
        "resume-profile-generated",
        JSON.stringify(response.resumeData)
      );

      navigate("/resume-builder");
    } catch (error) {
      console.error(error);
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
              Cargando tu perfil profesional...
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
              Completa tu perfil primero
            </h1>

            <p className="profile-page__description">
              Necesitas completar tu perfil profesional antes de generar
              currículums personalizados con IA.
            </p>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="profile-page__save-btn"
              style={{ marginTop: "1rem" }}
            >
              Ir a mi perfil
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
            Generar CV desde Perfil
          </h1>

          <p className="profile-page__description">
            Pega una oferta laboral y la IA generará un CV optimizado usando tu
            perfil profesional.
          </p>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="resume-builder-page__textarea"
            rows={12}
            placeholder="Pega aquí la oferta laboral..."
          />

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !jobDescription.trim()}
            className="profile-page__save-btn"
            style={{ marginTop: "1rem" }}
          >
            {isGenerating ? "Generando..." : "Generar CV"}
          </button>
        </div>
      </div>
    </main>
  );
}