import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../shared/components/layout/Header";
import { getFriendlyErrorMessage } from "../../../shared/services/apiClient";
import type { ResumeData } from "../types/resume.types";
import { normalizeResumeData } from "../utils/resumeNormalizer";
import {
  analyzeFinalAts,
  optimizeFullResume,
} from "../services/ai.service";
import "./ResumeOptimizePage.css";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";

export default function ResumeOptimizePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasOptimized = useRef(false);

  const rawResumeData = location.state as ResumeData | null;
  const resumeData = rawResumeData ? normalizeResumeData(rawResumeData) : null;

  const [status, setStatus] = useState("Preparando optimización con IA...");
  const [error, setError] = useState("");

  const goToOriginalResume = () => {
    if (!resumeData) {
      navigate("/resume-builder");
      return;
    }

    navigate("/resume/generate", {
      state: resumeData,
      replace: true,
    });
  };

  const retryOptimization = () => {
    hasOptimized.current = false;
    setError("");
    setStatus("Preparando optimización con IA...");
  };

  useEffect(() => {
    if (hasOptimized.current) return;
    hasOptimized.current = true;

    if (!resumeData) {
      navigate("/resume-builder");
      return;
    }

    const optimizeResume = async () => {
      try {
        setError("");
        setStatus(APP_MESSAGES.AI.OPTIMIZING);

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
          } catch (atsError) {
            console.warn("No se pudo completar el análisis ATS final.", atsError);
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
      } catch (optimizeError) {
        setError(getFriendlyErrorMessage(optimizeError));
        setStatus("No se pudo optimizar el CV con IA.");
      }
    };

    optimizeResume();
  }, [resumeData, navigate, error]);

  return (
    <main className="resume-optimize-page">
      <Header />

      <section className="resume-optimize-page__card">
        {!error && <div className="resume-optimize-page__loader" />}

        <h1 className="resume-optimize-page__title">
          Optimizando tu currículum
        </h1>

        <p className="resume-optimize-page__status">{status}</p>

        {!error ? (
          <p className="resume-optimize-page__hint">
            Estamos optimizando tu CV, analizando su compatibilidad ATS y preparando tu PDF final.
          </p>
        ) : (
          <div className="resume-optimize-page__error-box">
            <p className="resume-optimize-page__hint">{error}</p>

            <div className="resume-optimize-page__actions">
              <button type="button" onClick={retryOptimization}>
                Intentar nuevamente
              </button>

              <button type="button" onClick={goToOriginalResume}>
                Generar CV original
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}