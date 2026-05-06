import type { ResumeData, Step } from "../types/resume.types";

type ValidationResult = {
  isValid: boolean;
  step?: Step;
  message?: string;
};

export function useResumeValidation() {
  const validateResumeData = (resumeData: ResumeData): ValidationResult => {
    if (!resumeData.fullName.trim()) {
      return {
        isValid: false,
        step: "personal",
        message: "Debes ingresar tu nombre completo.",
      };
    }

    if (!resumeData.email.trim()) {
      return {
        isValid: false,
        step: "personal",
        message: "Debes ingresar tu correo electrónico.",
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(resumeData.email)) {
      return {
        isValid: false,
        step: "personal",
        message: "Debes ingresar un correo electrónico válido.",
      };
    }

    if (!resumeData.summary.trim()) {
      return {
        isValid: false,
        step: "summary",
        message: "Debes agregar un resumen profesional.",
      };
    }

    return {
      isValid: true,
    };
  };

  return {
    validateResumeData,
  };
}