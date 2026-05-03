import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../shared/components/layout/Header";
import type { ResumeData } from "../types/resume.types";
import { optimizeFullResume } from "../services/ai.service";
import "./ResumeOptimizePage.css";

export default function ResumeOptimizePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasOptimized = useRef(false);

  const resumeData = location.state as ResumeData | null;

  const [status, setStatus] = useState("Preparando optimización con IA...");

  useEffect(() => {
    if (hasOptimized.current) return;
    hasOptimized.current = true;

    if (!resumeData) {
      navigate("/resume-builder");
      return;
    }

    const optimizeResume = async () => {
      try {
        setStatus("Analizando tu CV y la oferta laboral...");

        const result = await optimizeFullResume(
          resumeData,
          resumeData.jobDescription ?? ""
        );

        setStatus("Aplicando mejoras al contenido...");

        navigate("/resume/generate", {
          state: result.optimizedResumeData,
          replace: true,
        });
      } catch {
        setStatus("No se pudo optimizar con IA. Generando CV original...");

        navigate("/resume/generate", {
          state: resumeData,
          replace: true,
        });
      }
    };

    optimizeResume();
  }, [resumeData, navigate]);

  return (
    <main className="resume-optimize-page">
      <Header />

      <section className="resume-optimize-page__card">
        <div className="resume-optimize-page__loader" />

        <h1 className="resume-optimize-page__title">
          Optimizando tu currículum
        </h1>

        <p className="resume-optimize-page__status">{status}</p>

        <p className="resume-optimize-page__hint">
          La IA está ajustando el contenido para alinearlo mejor con la oferta laboral.
        </p>
      </section>
    </main>
  );
}