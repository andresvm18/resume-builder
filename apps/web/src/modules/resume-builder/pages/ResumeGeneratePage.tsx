import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../shared/components/layout/Header";
import type { ResumeData } from "../types/resume.types";
import type { FinalAtsAnalysisResponse } from "../services/ai.service";
import "./ResumeGeneratePage.css";

type ResumeGenerateState = ResumeData & {
  finalAtsAnalysis?: FinalAtsAnalysisResponse | null;
};

function formatFileName(name: string) {
  const cleanedName = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

  return cleanedName || "cv";
}

export default function ResumeGeneratePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasGenerated = useRef(false);

  const resumeData = location.state as ResumeGenerateState | null;
  const finalAtsAnalysis = resumeData?.finalAtsAnalysis ?? null;

  const [status, setStatus] = useState("Preparando generación del CV...");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("cv.pdf");
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState("");

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
        const token = localStorage.getItem("auth_token");

        if (!token) {
          navigate("/login");
          return;
        }

        setStatus("Enviando información al servidor...");

        const resumePayload = Object.fromEntries(
          Object.entries(resumeData).filter(([key]) => key !== "finalAtsAnalysis")
        );

        const response = await fetch("http://localhost:8080/api/resume/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(resumePayload),
        });

        setStatus("Generando PDF con LaTeX...");

        if (!response.ok) {
          throw new Error("No se pudo generar el CV.");
        }

        const blob = await response.blob();
        generatedUrl = URL.createObjectURL(blob);

        const generatedFileName = `${formatFileName(resumeData.fullName || "cv")}.pdf`;

        const link = document.createElement("a");
        link.href = generatedUrl;
        link.download = generatedFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setPdfUrl(generatedUrl);
        setFileName(generatedFileName);
        setStatus("CV generado correctamente.");
      } catch {
        setError("Ocurrió un error al generar el CV. Revisa que el backend esté corriendo.");
        setStatus("Error al generar el CV.");
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

      {/* ── Loading / error state: centred card ── */}
      {!pdfUrl && (
        <section className="resume-generate-page__card">
          <h1 className="resume-generate-page__title">
            Generando tu currículum
          </h1>

          <p className="resume-generate-page__status">{status}</p>

          {isGenerating && <div className="resume-generate-page__loader" />}

          {error && <p className="resume-generate-page__error">{error}</p>}
        </section>
      )}

      {/* ── Success state: full-width layout ── */}
      {pdfUrl && (
        <div className="resume-generate-page__success">
          {/* Top bar: title + status + actions */}
          <div className="resume-generate-page__top-bar">
            <h1 className="resume-generate-page__title">
              Tu currículum
            </h1>

            <p className="resume-generate-page__status">{status}</p>

            <div className="resume-generate-page__actions">
              <a
                href={pdfUrl}
                download={fileName}
                className="resume-generate-page__download"
              >
                Descargar CV
              </a>

              <button
                type="button"
                onClick={() => navigate("/resume-builder")}
                className="resume-generate-page__secondary"
              >
                Volver a editar
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="resume-generate-page__secondary"
              >
                Ir al dashboard
              </button>
            </div>
          </div>

          {/* PDF preview + ATS panel */}
          <div className="resume-generate-page__result-layout">
            <div className="resume-generate-page__preview">
              <iframe
                src={pdfUrl}
                title="Vista previa del CV"
              />
            </div>

            <aside className="resume-generate-page__ats-panel">
              <h2 className="resume-generate-page__ats-title">
                Análisis ATS
              </h2>

              {finalAtsAnalysis ? (
                <>
                  <div className="resume-generate-page__ats-score-card">
                    <span className="resume-generate-page__ats-score">
                      {finalAtsAnalysis.atsScore}%
                    </span>
                    <span className="resume-generate-page__ats-score-label">
                      Compatibilidad estimada
                    </span>
                  </div>

                  <p className="resume-generate-page__ats-disclaimer">
                    Esta puntuación es una estimación basada en los criterios
                    típicos de los sistemas ATS, no una evaluación realizada por
                    un sistema real. Los resultados pueden variar según el ATS
                    específico que utilice cada empresa.
                  </p>

                  {finalAtsAnalysis.summary && (
                    <p className="resume-generate-page__ats-summary">
                      {finalAtsAnalysis.summary}
                    </p>
                  )}

                  <AnalysisSection
                    title="Fortalezas"
                    items={finalAtsAnalysis.strengths}
                  />
                </>
              ) : (
                <p className="resume-generate-page__ats-empty">
                  No se pudo generar el análisis ATS.
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