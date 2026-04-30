import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../shared/components/layout/Header";
import type { ResumeData } from "../types/resume.types";
import "./ResumeGeneratePage.css";

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

  const resumeData = location.state as ResumeData | null;

  const [status, setStatus] = useState("Preparando generación del CV...");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("cv.pdf");
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

        const response = await fetch("http://localhost:8080/api/resume/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(resumeData),
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

      <section className="resume-generate-page__card">
        <h1 className="resume-generate-page__title">
          Generando tu currículum
        </h1>

        <p className="resume-generate-page__status">{status}</p>

        {isGenerating && <div className="resume-generate-page__loader" />}

        {error && <p className="resume-generate-page__error">{error}</p>}

        {pdfUrl && (
          <>
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
            </div>

            <div className="resume-generate-page__preview">
              <iframe
                src={pdfUrl}
                title="Vista previa del CV"
                width="100%"
                height="650"
              />
            </div>
          </>
        )}
      </section>
    </main>
  );
}