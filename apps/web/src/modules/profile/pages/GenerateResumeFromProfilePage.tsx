import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../../shared/components/layout/Header";

import { generateResumeFromProfile } from "../services/profile-ai.service";

export default function GenerateResumeFromProfilePage() {
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

  return (
    <main className="profile-page">
      <Header />

      <div className="profile-page__container">
        <div className="profile-page__card">
          <h1 className="profile-page__title">
            Generar CV desde Perfil
          </h1>

          <p className="profile-page__description">
            Pega una oferta laboral y la IA generará un CV
            optimizado usando tu perfil profesional.
          </p>

          <textarea
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
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
            {isGenerating
              ? "Generando..."
              : "Generar CV"}
          </button>
        </div>
      </div>
    </main>
  );
}