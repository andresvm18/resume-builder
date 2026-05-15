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

  const [status, setStatus] = useState<string>(APP_MESSAGES.RESUME_OPTIMIZE.INITIAL_STATUS);
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
    setStatus(APP_MESSAGES.RESUME_OPTIMIZE.INITIAL_STATUS);
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
            setStatus(APP_MESSAGES.RESUME_OPTIMIZE.ANALYZING_STATUS);

            finalAtsAnalysis = await analyzeFinalAts(
              result.optimizedResumeData,
              resumeData.jobDescription
            );
          } catch {
            setStatus(APP_MESSAGES.PDF.OPTIMIZATION_ERROR);
          }
        }

        setStatus(APP_MESSAGES.PDF.PREPARING);

        navigate("/resume/generate", {
          state: {
            ...result.optimizedResumeData,
            finalAtsAnalysis,
          },
          replace: true,
        });
      } catch (optimizeError) {
        setError(getFriendlyErrorMessage(optimizeError));
        setStatus(APP_MESSAGES.RESUME_OPTIMIZE.ERROR_STATUS);
      }
    };

    optimizeResume();
  }, [resumeData, navigate]);

  return (
    <main className="resume-optimize-page">
      <Header />

      <section className="resume-optimize-page__card">
        {!error && <div className="resume-optimize-page__loader" />}

        <h1 className="resume-optimize-page__title">
          {APP_MESSAGES.RESUME_OPTIMIZE.TITLE}
        </h1>

        <p className="resume-optimize-page__status">{status}</p>

        {!error ? (
          <p className="resume-optimize-page__hint">
            {APP_MESSAGES.RESUME_OPTIMIZE.HINT_TEXT}
          </p>
        ) : (
          <div className="resume-optimize-page__error-box">
            <p className="resume-optimize-page__hint">{error}</p>

            <div className="resume-optimize-page__actions">
              <button type="button" onClick={retryOptimization}>
                {APP_MESSAGES.RESUME_OPTIMIZE.RETRY_BUTTON}
              </button>

              <button type="button" onClick={goToOriginalResume}>
                {APP_MESSAGES.RESUME_OPTIMIZE.GENERATE_ORIGINAL_BUTTON}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}