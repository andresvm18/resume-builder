import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Header from "../../../shared/components/layout/Header";
import StepWizard from "../components/StepWizard";
import StepNavigation from "../components/StepNavigation";
import ResumeFormPanel from "../components/ResumeFormPanel";
import AtsRecommendationsPanel from "../components/AtsRecommendationsPanel";
import { useResumeBuilder } from "../hooks/useResumeBuilder";
import type { StepItem } from "../types/resume.types";
import {
  getAiRecommendations,
  optimizeSummary,
  type AiRecommendationsResponse,
} from "../services/ai.service";
import "./ResumeBuilderPage.css";

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isOptimizingSummary, setIsOptimizingSummary] = useState(false);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] =
    useState(false);
  const [recommendationsFailed, setRecommendationsFailed] = useState(false);
  const [aiRecommendations, setAiRecommendations] =
    useState<AiRecommendationsResponse | null>(null);

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
    location,
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
  } = useResumeBuilder(id);

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

  const validateResumeData = () => {
    if (!resumeData.fullName.trim()) {
      alert("Debes ingresar tu nombre completo.");
      setCurrentStep("personal");
      return false;
    }

    if (!resumeData.email.trim()) {
      alert("Debes ingresar tu correo electrónico.");
      setCurrentStep("personal");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(resumeData.email)) {
      alert("Debes ingresar un correo electrónico válido.");
      setCurrentStep("personal");
      return false;
    }

    if (!resumeData.summary.trim()) {
      alert("Debes agregar un resumen profesional.");
      setCurrentStep("summary");
      return false;
    }

    return true;
  };

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
      alert("No se pudo optimizar el resumen.");
    } finally {
      setIsOptimizingSummary(false);
    }
  };

  const generateRecommendationsBeforeSummary = async () => {
    if (!jobDescription.trim()) {
      goToStep("summary");
      return;
    }

    try {
      setIsGeneratingRecommendations(true);
      setRecommendationsFailed(false);
      setAiRecommendations(null);

      const result = await getAiRecommendations(resumeData, jobDescription);

      setAiRecommendations(result);

      goToStep("summary");
    } catch {
      setRecommendationsFailed(true);
      alert("No se pudieron generar recomendaciones con IA. Puedes continuar manualmente.");
      goToStep("summary");
    } finally {
      setIsGeneratingRecommendations(false);
    }
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

  const handleFinish = () => {
    if (!validateResumeData()) return;

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
            La IA está revisando la oferta laboral para sugerirte mejoras antes de continuar.
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
        <div className="resume-builder-page__container">
          <StepWizard
            steps={steps}
            currentStep={currentStep}
            isStepCompleted={() => false}
            getStepIndex={(step) => steps.findIndex((s) => s.id === step)}
            onStepClick={goToStep}
          />

          <ResumeFormPanel
            currentStep={currentStep}
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            location={location}
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