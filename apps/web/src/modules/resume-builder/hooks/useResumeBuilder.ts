import { useEffect, useRef, useState } from "react";
import { DEFAULT_RESUME_DATA } from "../types/resume.types";
import { fetchResumeById } from "../services/resume.service";
import { normalizeResumeData } from "../utils/resumeNormalizer";
import type {
  ResumeData,
  Experience,
  Education,
  Project,
  Language,
  LanguageLevel,
  Step,
} from "../types/resume.types";

const STORAGE_KEY = "resume-data";

type UseResumeBuilderOptions = {
  initialData?: unknown;
  onResumeNotFound?: () => void;
};

export function useResumeBuilder(
  resumeId?: string,
  options: UseResumeBuilderOptions = {}
) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const [resumeData, setResumeData] = useState<ResumeData>(() =>
    options.initialData
      ? normalizeResumeData(options.initialData)
      : DEFAULT_RESUME_DATA
  );

  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [skillInput, setSkillInput] = useState("");

  const { onResumeNotFound } = options;
  useEffect(() => {
    if (!resumeId) return;

    const loadResume = async () => {
      try {
        const resume = await fetchResumeById(resumeId);
        const latestVersion = resume.versions?.[0];

        if (latestVersion?.data) {
          setResumeData(normalizeResumeData(latestVersion.data));
        }
      } catch (error) {
        console.error("Error loading resume:", error);
        onResumeNotFound?.();
      }
    };

    loadResume();
  }, [resumeId, onResumeNotFound]);


  const updateField = <K extends keyof ResumeData>(
    field: K,
    value: ResumeData[K]
  ) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Skills
  const addSkill = () => {
    const parsedSkills = skillInput
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (parsedSkills.length === 0) return;

    setResumeData((prev) => {
      const existingSkills = prev.skills.map((skill) => skill.toLowerCase());

      const uniqueSkills = parsedSkills.filter(
        (skill) => !existingSkills.includes(skill.toLowerCase())
      );

      if (uniqueSkills.length === 0) return prev;

      return {
        ...prev,
        skills: [...prev.skills, ...uniqueSkills],
      };
    });

    setSkillInput("");
  };

  const removeSkill = (index: number) => {
    updateField(
      "skills",
      resumeData.skills.filter((_, i) => i !== index)
    );
  };

  // Languages
  const addLanguage = () => {
    updateField("languages", [
      ...resumeData.languages,
      {
        id: crypto.randomUUID(),
        name: "",
        level: "Advanced",
      },
    ]);
  };

  const updateLanguage = (
    id: string | number,
    field: keyof Language,
    value: string
  ) => {
    updateField(
      "languages",
      resumeData.languages.map((lang) =>
        lang.id === id
          ? {
            ...lang,
            [field]: field === "level" ? (value as LanguageLevel) : value,
          }
          : lang
      )
    );
  };

  const removeLanguage = (id: string | number) => {
    updateField(
      "languages",
      resumeData.languages.filter((lang) => lang.id !== id)
    );
  };

  // Experience
  const addExperience = () => {
    updateField("experiences", [
      ...resumeData.experiences,
      {
        id: crypto.randomUUID(),
        title: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const updateExperience = (
    id: string | number,
    field: keyof Experience,
    value: string
  ) => {
    updateField(
      "experiences",
      resumeData.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const removeExperience = (id: string | number) => {
    updateField(
      "experiences",
      resumeData.experiences.filter((exp) => exp.id !== id)
    );
  };

  // Education
  const addEducation = () => {
    updateField("education", [
      ...resumeData.education,
      {
        id: crypto.randomUUID(),
        institution: "",
        degree: "",
        date: "",
      },
    ]);
  };

  const updateEducation = (
    id: string | number,
    field: keyof Education,
    value: string
  ) => {
    updateField(
      "education",
      resumeData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const removeEducation = (id: string | number) => {
    updateField(
      "education",
      resumeData.education.filter((edu) => edu.id !== id)
    );
  };

  // Projects
  const addProject = () => {
    updateField("projects", [
      ...resumeData.projects,
      {
        id: crypto.randomUUID(),
        name: "",
        technologies: "",
        description: "",
        link: "",
      },
    ]);
  };

  const updateProject = (
    id: string | number,
    field: keyof Project,
    value: string
  ) => {
    updateField(
      "projects",
      resumeData.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    );
  };

  const removeProject = (id: string | number) => {
    updateField(
      "projects",
      resumeData.projects.filter((proj) => proj.id !== id)
    );
  };

  const clearForm = () => {
    if (confirm("¿Estás seguro de que quieres limpiar todos los datos?")) {
      setResumeData(DEFAULT_RESUME_DATA);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    resumeRef,

    resumeData,
    currentStep,
    setCurrentStep,
    skillInput,
    setSkillInput,

    fullName: resumeData.fullName,
    setFullName: (value: string) => updateField("fullName", value),

    email: resumeData.email,
    setEmail: (value: string) => updateField("email", value),

    phone: resumeData.phone,
    setPhone: (value: string) => updateField("phone", value),

    location: resumeData.location,
    setLocation: (value: string) => updateField("location", value),

    summary: resumeData.summary,
    setSummary: (value: string) => updateField("summary", value),

    jobDescription: resumeData.jobDescription,
    setJobDescription: (value: string) => updateField("jobDescription", value),

    skills: resumeData.skills,
    languages: resumeData.languages,
    experiences: resumeData.experiences,
    education: resumeData.education,
    projects: resumeData.projects,

    addSkill,
    removeSkill,

    addLanguage,
    updateLanguage,
    removeLanguage,

    addExperience,
    updateExperience,
    removeExperience,

    addEducation,
    updateEducation,
    removeEducation,

    addProject,
    updateProject,
    removeProject,

    clearForm,
  };
}