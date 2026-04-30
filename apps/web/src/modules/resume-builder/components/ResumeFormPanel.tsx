// components/ResumeFormPanel.tsx

import PersonalStep from "./steps/PersonalStep";
import SummaryStep from "./steps/SummaryStep";
import ExperienceStep from "./steps/ExperienceStep";
import EducationStep from "./steps/EducationStep";
import SkillsStep from "./steps/SkillsStep";
import LanguagesStep from "./steps/LanguagesStep";
import ProjectsStep from "./steps/ProjectsStep";
import JobDescriptionStep from "./steps/JobDescriptionStep";
import type {
  Step,
  Experience,
  Education,
  Project,
  Language,
} from "../types/resume.types";

type ResumeFormPanelProps = {
  currentStep: Step;

  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;

  summary: string;
  setSummary: (value: string) => void;

  experiences: Experience[];
  addExperience: () => void;
  updateExperience: (
    id: string | number,
    field: keyof Experience,
    value: string
  ) => void;
  removeExperience: (id: string | number) => void;

  education: Education[];
  addEducation: () => void;
  updateEducation: (
    id: string | number,
    field: keyof Education,
    value: string
  ) => void;
  removeEducation: (id: string | number) => void;

  skills: string[];
  skillInput: string;
  setSkillInput: (value: string) => void;
  addSkill: () => void;
  removeSkill: (index: number) => void;

  languages: Language[];
  addLanguage: () => void;
  updateLanguage: (
    id: string | number,
    field: keyof Language,
    value: string
  ) => void;
  removeLanguage: (id: string | number) => void;

  projects: Project[];
  addProject: () => void;
  updateProject: (
    id: string | number,
    field: keyof Project,
    value: string
  ) => void;
  removeProject: (id: string | number) => void;

  jobDescription: string;
  setJobDescription: (value: string) => void;
};

export default function ResumeFormPanel(props: ResumeFormPanelProps) {
  switch (props.currentStep) {
    case "personal":
      return <PersonalStep {...props} />;

    case "summary":
      return <SummaryStep {...props} />;

    case "experience":
      return <ExperienceStep {...props} />;

    case "education":
      return <EducationStep {...props} />;

    case "skills":
      return <SkillsStep {...props} />;

    case "languages":
      return <LanguagesStep {...props} />;

    case "projects":
      return <ProjectsStep {...props} />;

    case "jobDescription":
      return (
        <JobDescriptionStep {...props} />
      );

    default:
      return null;
  }
}