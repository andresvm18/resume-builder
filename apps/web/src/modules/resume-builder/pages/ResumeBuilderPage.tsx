import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
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
import "./ResumeBuilderPage.css";

export default function ResumeBuilderPage() {
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [isOptimizingSummary, setIsOptimizingSummary] = useState(false);

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
  } = useResumeBuilder(id, {
    initialData: routerLocation.state,
    onResumeNotFound: () => {
      alert("No encontramos ese CV. Puede haber sido eliminado o no tienes acceso.");
      navigate("/dashboard");
    },
  });

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

    const result = await generateRecommendations(resumeData, jobDescription);

    if (!result) {
      alert("No se pudieron generar recomendaciones con IA. Puedes continuar manualmente.");
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

  const handleFinish = () => {
    const result = validateResumeData(resumeData);

    if (!result.isValid) {
      if (result.message) {
        alert(result.message);
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