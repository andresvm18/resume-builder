import { useNavigate } from "react-router-dom";
import Header from "../../../shared/components/layout/Header";
import StepWizard from "../components/StepWizard";
import StepNavigation from "../components/StepNavigation";
import ResumeFormPanel from "../components/ResumeFormPanel";
import { useResumeBuilder } from "../hooks/useResumeBuilder";
import type { StepItem } from "../types/resume.types";
import "./ResumeBuilderPage.css";

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
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

  } = useResumeBuilder();

  const steps: StepItem[] = [
    {
      id: "personal",
      label: "Personal",
      title: "Información personal",
      description: "Tus datos básicos de contacto",
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
            getStepIndex={(step) =>
              steps.findIndex((s) => s.id === step)
            }
            onStepClick={setCurrentStep}
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
          />

          <StepNavigation
            currentIndex={steps.findIndex((s) => s.id === currentStep)}
            totalSteps={steps.length}
            onPrev={() => {
              const index = steps.findIndex((s) => s.id === currentStep);
              if (index > 0) setCurrentStep(steps[index - 1].id);
            }}
            onNext={() => {
              const index = steps.findIndex((s) => s.id === currentStep);
              if (index < steps.length - 1) {
                setCurrentStep(steps[index + 1].id);
              }
            }}
            onFinish={() => {
              navigate("/resume/generate", {
                state: resumeData,
              });
            }}
          />
        </div>
      </section>
    </main>
  );
}