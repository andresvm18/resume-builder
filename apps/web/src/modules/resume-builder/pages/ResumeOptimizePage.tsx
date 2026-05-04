import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../shared/components/layout/Header";
import type { ResumeData } from "../types/resume.types";
import {
  analyzeFinalAts,
  optimizeFullResume,
} from "../services/ai.service";
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
        setStatus("Optimizando tu CV con IA...");

        const result = await optimizeFullResume(
          resumeData,
          resumeData.jobDescription ?? ""
        );

        let finalAtsAnalysis = null;

        if (resumeData.jobDescription?.trim()) {
          try {
            setStatus("Analizando el CV final como un sistema ATS...");

            finalAtsAnalysis = await analyzeFinalAts(
              result.optimizedResumeData,
              resumeData.jobDescription
            );
          } catch {
            console.warn("No se pudo completar el análisis ATS final.");
          }
        }

        setStatus("Preparando generación del PDF...");

        navigate("/resume/generate", {
          state: {
            ...result.optimizedResumeData,
            finalAtsAnalysis,
          },
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
          Estamos optimizando tu CV, analizando su compatibilidad ATS y preparando tu PDF final.
        </p>
      </section>
    </main>
  );
}