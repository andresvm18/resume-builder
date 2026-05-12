import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Header from "../../../shared/components/layout/Header";
import StepWizard from "../components/StepWizard";
import StepNavigation from "../components/StepNavigation";
import ResumeFormPanel from "../components/ResumeFormPanel";
import AtsRecommendationsPanel from "../components/AtsRecommendationsPanel";
import { useResumeBuilder } from "../hooks/useResumeBuilder";
import type { StepItem } from "../types/resume.types";
import { useResumeValidation } from "../hooks/useResumeValidation";
import { useAiRecommendations } from "../hooks/useAiRecommendations";
import { optimizeSummary } from "../services/ai.service";
import { updateResumeById } from "../services/resume.service";
import TemplateSelector from "../components/TemplateSelector";
import { useToast } from "../../../shared/context/useToast";
import "./ResumeBuilderPage.css";

type SaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

export default function ResumeBuilderPage() {
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();

  const [isOptimizingSummary, setIsOptimizingSummary] = useState(false);
  const [isSavingResume, setIsSavingResume] = useState(false);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const hasLoadedEditorRef = useRef(false);
  const isAutoSavingRef = useRef(false);

  const {
    resumeData,
    currentStep,
    setCurrentStep,

    fullName,
    setFullName,
    email,
    setEmail,
    phone,
    setPhone,
    location: resumeLocation,
    setLocation,

    summary,
    setSummary,

    skills,
    skillInput,
    setSkillInput,
    addSkill,
    removeSkill,

    languages,
    addLanguage,
    updateLanguage,
    removeLanguage,

    experiences,
    addExperience,
    updateExperience,
    removeExperience,

    education,
    addEducation,
    updateEducation,
    removeEducation,

    projects,
    addProject,
    updateProject,
    removeProject,

    jobDescription,
    setJobDescription,

    targetRole,
    setTargetRole,

    targetCompany,
    setTargetCompany,

    template,
    setTemplate,
  } = useResumeBuilder(id, {
    initialData: routerLocation.state,
    onResumeNotFound: () => {
      showToast(
        "No encontramos ese CV. Puede haber sido eliminado o no tienes acceso",
        "error"
      );
      navigate("/dashboard");
    },
  });

  const latestResumeDataRef = useRef(resumeData);

  useEffect(() => {
    latestResumeDataRef.current = resumeData;

    if (!id) return;

    if (!hasLoadedEditorRef.current) {
      hasLoadedEditorRef.current = true;
      return;
    }

    if (isAutoSavingRef.current) return;

    setSaveStatus("unsaved");
  }, [resumeData, id]);

  useEffect(() => {
    if (!id || saveStatus !== "unsaved") return;

    const timeoutId = window.setTimeout(async () => {
      try {
        isAutoSavingRef.current = true;
        setSaveStatus("saving");

        await updateResumeById(id, latestResumeDataRef.current);

        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      } finally {
        isAutoSavingRef.current = false;
      }
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [id, saveStatus]);

  const { validateResumeData } = useResumeValidation();

  const {
    aiRecommendations,
    isGeneratingRecommendations,
    recommendationsFailed,
    generateRecommendations,
  } = useAiRecommendations();

  const steps: StepItem[] = [
    {
      id: "personal",
      label: "Personal",
      title: "Información personal",
      description: "Tus datos básicos de contacto",
    },
    {
      id: "jobDescription",
      label: "Oferta",
      title: "Oferta laboral",
      description: "Pega la descripción del puesto objetivo",
    },
    {
      id: "summary",
      label: "Resumen",
      title: "Resumen profesional",
      description: "Describe tu perfil en pocas líneas",
    },
    {
      id: "experience",
      label: "Experiencia",
      title: "Experiencia laboral",
      description: "Tus trabajos y responsabilidades",
    },
    {
      id: "education",
      label: "Educación",
      title: "Formación académica",
      description: "Tus estudios y certificaciones",
    },
    {
      id: "skills",
      label: "Habilidades",
      title: "Habilidades",
      description: "Tus competencias técnicas y blandas",
    },
    {
      id: "languages",
      label: "Idiomas",
      title: "Idiomas",
      description: "Tus competencias lingüísticas",
    },
    {
      id: "projects",
      label: "Proyectos",
      title: "Proyectos",
      description: "Trabajos destacados y personales",
    },
  ];

  const goToStep = (stepId: StepItem["id"]) => {
    setCurrentStep(stepId);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleOptimizeSummary = async () => {
    try {
      setIsOptimizingSummary(true);

      const result = await optimizeSummary(resumeData, jobDescription ?? "");

      setSummary(result.optimizedSummary);
    } catch {
      showToast("No se pudo optimizar el resumen", "error");
    } finally {
      setIsOptimizingSummary(false);
    }
  };

  const generateRecommendationsBeforeSummary = async () => {
    if (!jobDescription.trim()) {
      goToStep("summary");
      return;
    }

    const result = await generateRecommendations(resumeData, jobDescription);

    if (!result) {
      showToast(
        "No se pudieron generar recomendaciones con IA. Puedes continuar manualmente",
        "error"
      );
    }

    goToStep("summary");
  };

  const handleNext = async () => {
    const index = steps.findIndex((s) => s.id === currentStep);

    if (currentStep === "jobDescription") {
      await generateRecommendationsBeforeSummary();
      return;
    }

    if (index < steps.length - 1) {
      goToStep(steps[index + 1].id);
    }
  };

  const handleSaveExistingResume = async () => {
    if (!id) return;

    try {
      setIsSavingResume(true);
      setSaveStatus("saving");

      await updateResumeById(id, resumeData);

      setSaveStatus("saved");
      showToast("CV actualizado correctamente", "success");
    } catch {
      setSaveStatus("error");
      showToast("No se pudo guardar el CV", "error");
    } finally {
      setIsSavingResume(false);
    }
  };

  const handleFinish = () => {
    const result = validateResumeData(resumeData);

    if (!result.isValid) {
      if (result.message) {
        showToast(result.message, "error");
      }

      if (result.step) {
        setCurrentStep(result.step);
      }

      return;
    }

    navigate("/resume/optimize", {
      state: {
        ...resumeData,
        aiRecommendations,
      },
    });
  };

  if (isGeneratingRecommendations) {
    return (
      <main className="resume-builder-page">
        <Header />

        <section className="resume-builder-page__loading-card">
          <div className="resume-builder-page__loading-spinner" />

          <h1 className="resume-builder-page__loading-title">
            Generando recomendaciones
          </h1>

          <p className="resume-builder-page__loading-text">
            La IA está revisando la oferta laboral para sugerirte mejoras antes
            de continuar.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="resume-builder-page">
      <Header />

      <section className="resume-builder-page__hero">
        <div className="resume-builder-page__hero-content">
          <h1 className="resume-builder-page__title">
            Diseña tu currículum profesional
          </h1>
          <p className="resume-builder-page__subtitle">
            Crea un CV moderno, estructurado y listo para destacar.
          </p>
        </div>
      </section>

      <section className="resume-builder-page__content">
        <div className="resume-builder-page__container rb-fade-up">
          <StepWizard
            steps={steps}
            currentStep={currentStep}
            isStepCompleted={() => false}
            getStepIndex={(step) => steps.findIndex((s) => s.id === step)}
            onStepClick={goToStep}
          />

          <TemplateSelector template={template} setTemplate={setTemplate} />

          <ResumeFormPanel
            currentStep={currentStep}
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            location={resumeLocation}
            setLocation={setLocation}
            summary={summary}
            setSummary={setSummary}
            experiences={experiences}
            addExperience={addExperience}
            updateExperience={updateExperience}
            removeExperience={removeExperience}
            education={education}
            addEducation={addEducation}
            updateEducation={updateEducation}
            removeEducation={removeEducation}
            skills={skills}
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            addSkill={addSkill}
            removeSkill={removeSkill}
            languages={languages}
            addLanguage={addLanguage}
            updateLanguage={updateLanguage}
            removeLanguage={removeLanguage}
            projects={projects}
            addProject={addProject}
            updateProject={updateProject}
            removeProject={removeProject}
            jobDescription={jobDescription}
            targetRole={targetRole}
            setTargetRole={setTargetRole}
            targetCompany={targetCompany}
            setTargetCompany={setTargetCompany}
            setJobDescription={setJobDescription}
            isOptimizingSummary={isOptimizingSummary}
            onOptimizeSummary={handleOptimizeSummary}
          />

          {currentStep === "summary" &&
            (aiRecommendations || recommendationsFailed) && (
              <AtsRecommendationsPanel
                recommendations={aiRecommendations}
                hasError={recommendationsFailed}
              />
            )}

          {id && (
            <div className="resume-builder-page__save-row">
              <span
                className={`resume-builder-page__save-status resume-builder-page__save-status--${saveStatus}`}
              >
                {saveStatus === "idle" && "Editor listo"}
                {saveStatus === "unsaved" && "Cambios sin guardar"}
                {saveStatus === "saving" && "Guardando..."}
                {saveStatus === "saved" && "Guardado automáticamente"}
                {saveStatus === "error" && "No se pudo guardar"}
              </span>

              <button
                type="button"
                onClick={handleSaveExistingResume}
                disabled={isSavingResume || saveStatus === "saving"}
                className="resume-builder-page__save-existing-btn"
              >
                {isSavingResume || saveStatus === "saving"
                  ? "Guardando..."
                  : "Guardar cambios"}
              </button>
            </div>
          )}

          <StepNavigation
            currentIndex={steps.findIndex((s) => s.id === currentStep)}
            totalSteps={steps.length}
            onPrev={() => {
              const index = steps.findIndex((s) => s.id === currentStep);
              if (index > 0) goToStep(steps[index - 1].id);
            }}
            onNext={handleNext}
            onFinish={handleFinish}
            disableNext={isGeneratingRecommendations}
          />
        </div>
      </section>
    </main>
  );
}