import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../shared/components/layout/Header";
import type { ResumeData } from "../types/resume.types";
import type { FinalAtsAnalysisResponse } from "../services/ai.service";
import { generateResumePdf } from "../services/resume.service";
import { normalizeResumeData } from "../utils/resumeNormalizer";
import { getFriendlyErrorMessage } from "../../../shared/services/apiClient";
import { APP_MESSAGES } from "../../../shared/constants/appMessages";
import "./ResumeGeneratePage.css";

type ResumeGenerateState = ResumeData & {
  finalAtsAnalysis?: FinalAtsAnalysisResponse | null;
};

const loadingMessages = [
  APP_MESSAGES.RESUME_GENERATE.LOADING_MESSAGE_1,
  APP_MESSAGES.RESUME_GENERATE.LOADING_MESSAGE_2,
  APP_MESSAGES.RESUME_GENERATE.LOADING_MESSAGE_3,
  APP_MESSAGES.RESUME_GENERATE.LOADING_MESSAGE_4,
];

function formatFileName(name: string) {
  const cleanedName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join("");

  return cleanedName || "CV";
}

export default function ResumeGeneratePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasGenerated = useRef(false);

  const resumeData = location.state as ResumeGenerateState | null;
  const finalAtsAnalysis = resumeData?.finalAtsAnalysis ?? null;

  const [status, setStatus] = useState<string>(APP_MESSAGES.RESUME_GENERATE.INITIAL_STATUS);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("cv.pdf");
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState("");
  const [generatedResumeData, setGeneratedResumeData] =
    useState<ResumeData | null>(null);

  const handleBackToEdit = () => {
    navigate("/resume-builder", {
      state: generatedResumeData ?? resumeData,
    });
  };

  useEffect(() => {
    if (!isGenerating) return;

    const intervalId = window.setInterval(() => {
      setLoadingMessageIndex((currentIndex) =>
        currentIndex === loadingMessages.length - 1 ? currentIndex : currentIndex + 1
      );
    }, 1200);

    return () => window.clearInterval(intervalId);
  }, [isGenerating]);

  useEffect(() => {
    if (hasGenerated.current) return;
    hasGenerated.current = true;

    if (!resumeData) {
      navigate("/resume-builder");
      return;
    }

    let generatedUrl: string | null = null;

    const generateResume = async () => {
      try {
        setStatus(APP_MESSAGES.RESUME_GENERATE.SENDING_STATUS);

        const rawPayload = Object.fromEntries(
          Object.entries(resumeData).filter(([key]) => key !== "finalAtsAnalysis")
        ) as ResumeData;

        const resumePayload = normalizeResumeData(rawPayload);

        setGeneratedResumeData(resumePayload);

        setStatus(APP_MESSAGES.RESUME_GENERATE.GENERATING_STATUS);

        const blob = await generateResumePdf(resumePayload);

        generatedUrl = URL.createObjectURL(blob);

        const generatedFileName = `${formatFileName(resumePayload.fullName || "cv")}.pdf`;

        const link = document.createElement("a");
        link.href = generatedUrl;
        link.download = generatedFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setPdfUrl(generatedUrl);
        setFileName(generatedFileName);
        setStatus(APP_MESSAGES.RESUME_GENERATE.SUCCESS_STATUS);
      } catch (err) {
        setError(getFriendlyErrorMessage(err));
        setStatus(APP_MESSAGES.RESUME_GENERATE.ERROR_STATUS);
      } finally {
        setIsGenerating(false);
      }
    };

    generateResume();

    return () => {
      if (generatedUrl) {
        URL.revokeObjectURL(generatedUrl);
      }
    };
  }, [resumeData, navigate]);

  return (
    <main className="resume-generate-page">
      <Header />

      {!pdfUrl && (
        <section className="resume-generate-page__card">
          <h1 className="resume-generate-page__title">
            {APP_MESSAGES.RESUME_GENERATE.GENERATING_TITLE}
          </h1>

          <p
            key={loadingMessageIndex}
            className="resume-generate-page__status resume-generate-page__status--animated"
          >
            {isGenerating ? loadingMessages[loadingMessageIndex] : status}
          </p>

          {isGenerating && <div className="resume-generate-page__loader" />}

          {error && (
            <div className="resume-generate-page__error-box">
              <p className="resume-generate-page__error-title">
                {APP_MESSAGES.RESUME_GENERATE.ERROR_TITLE}
              </p>

              <p className="resume-generate-page__error-message">
                {error}
              </p>

              <div className="resume-generate-page__error-actions">
                <button
                  type="button"
                  onClick={handleBackToEdit}
                  className="resume-generate-page__secondary"
                >
                  {APP_MESSAGES.RESUME_GENERATE.BACK_TO_EDIT_BUTTON}
                </button>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="resume-generate-page__download"
                >
                  {APP_MESSAGES.RESUME_GENERATE.RETRY_BUTTON}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {pdfUrl && (
        <div className="resume-generate-page__success">
          <div className="resume-generate-page__top-bar">
            <h1 className="resume-generate-page__title">
              {APP_MESSAGES.RESUME_GENERATE.SUCCESS_TITLE}
            </h1>

            <p className="resume-generate-page__status">{status}</p>

            <div className="resume-generate-page__actions">
              <a
                href={pdfUrl}
                download={fileName}
                className="resume-generate-page__download"
              >
                {APP_MESSAGES.RESUME_GENERATE.DOWNLOAD_BUTTON}
              </a>

              <button
                type="button"
                onClick={handleBackToEdit}
                className="resume-generate-page__secondary"
              >
                {APP_MESSAGES.RESUME_GENERATE.BACK_TO_EDIT_BUTTON}
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="resume-generate-page__secondary"
              >
                {APP_MESSAGES.RESUME_GENERATE.GO_TO_DASHBOARD_BUTTON}
              </button>
            </div>
          </div>

          <div className="resume-generate-page__result-layout">
            <div className="resume-generate-page__preview">
              <iframe
                src={pdfUrl}
                title="Vista previa del CV"
              />
            </div>

            <aside className="resume-generate-page__ats-panel">
              <h2 className="resume-generate-page__ats-title">
                {APP_MESSAGES.RESUME_GENERATE.ATS_PANEL_TITLE}
              </h2>

              {finalAtsAnalysis ? (
                <>
                  <div className="resume-generate-page__ats-score-card">
                    <span className="resume-generate-page__ats-score">
                      {finalAtsAnalysis.atsScore}%
                    </span>
                    <span className="resume-generate-page__ats-score-label">
                      {APP_MESSAGES.RESUME_GENERATE.ATS_SCORE_LABEL}
                    </span>
                  </div>

                  <p className="resume-generate-page__ats-disclaimer">
                    {APP_MESSAGES.RESUME_GENERATE.ATS_DISCLAIMER}
                  </p>

                  {finalAtsAnalysis.summary && (
                    <p className="resume-generate-page__ats-summary">
                      {finalAtsAnalysis.summary}
                    </p>
                  )}

                  <AnalysisSection
                    title={APP_MESSAGES.RESUME_GENERATE.ATS_STRENGTHS_TITLE}
                    items={finalAtsAnalysis.strengths}
                  />
                </>
              ) : (
                <p className="resume-generate-page__ats-empty">
                  {APP_MESSAGES.RESUME_GENERATE.ATS_EMPTY}
                </p>
              )}
            </aside>
          </div>
        </div>
      )}
    </main>
  );
}

type AnalysisSectionProps = {
  title: string;
  items: string[];
  variant?: "list" | "tags";
};

function AnalysisSection({
  title,
  items,
  variant = "list",
}: AnalysisSectionProps) {
  if (!items.length) return null;

  return (
    <section className="resume-generate-page__ats-section">
      <h3 className="resume-generate-page__ats-section-title">{title}</h3>

      {variant === "tags" ? (
        <div className="resume-generate-page__ats-tags">
          {items.map((item) => (
            <span key={item} className="resume-generate-page__ats-tag">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <ul className="resume-generate-page__ats-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}