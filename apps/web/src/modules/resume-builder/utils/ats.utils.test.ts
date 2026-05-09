import {
  getTopKeywords,
  analyzeResumeMatch,
} from "./ats.utils";

import type { ResumeData } from "../types/resume.types";

const baseResume: ResumeData = {
  fullName: "Andrés Víquez",
  email: "andres@test.com",
  phone: "8888-8888",
  location: "Costa Rica",
  summary: "Profesional con experiencia en soporte técnico y atención al cliente.",
  skills: ["Soporte técnico", "Jira", "Redes"],
  languages: [],
  experiences: [
    {
      id: "1",
      title: "Agente de soporte técnico",
      location: "San José",
      startDate: "2024",
      endDate: "2025",
      description:
        "Resolución de problemas técnicos, atención a usuarios y manejo de tickets en Jira.",
    },
  ],
  education: [],
  projects: [],
  jobDescription: "",
  template: "classic"
};

describe("ATS utils", () => {
  it("extracts relevant keywords from a Spanish job description", () => {
    const jobDescription =
      "Buscamos agente de soporte técnico con experiencia en resolución de problemas, atención al cliente, redes y manejo de Jira.";

    const keywords = getTopKeywords(jobDescription, 8);

    expect(keywords.length).toBeGreaterThan(0);
    expect(keywords.join(" ")).toContain("soporte");
    expect(keywords.join(" ")).toContain("jira");
  });

  it("matches resume content against job description keywords", () => {
    const jobDescription =
      "Se requiere soporte técnico, resolución de problemas, atención a usuarios, redes y Jira.";

    const result = analyzeResumeMatch(baseResume, jobDescription);

    expect(result.keywords.length).toBeGreaterThan(0);
    expect(result.matchPercentage).toBeGreaterThan(0);
    expect(result.matchedKeywords.length).toBeGreaterThan(0);
  });

  it("returns missing keywords when resume does not include job requirements", () => {
    const jobDescription =
      "Se requiere experiencia en contabilidad, facturación, inventario y conciliaciones bancarias.";

    const result = analyzeResumeMatch(baseResume, jobDescription);

    expect(result.missingKeywords.length).toBeGreaterThan(0);
    expect(result.matchPercentage).toBeLessThan(100);
  });

  it("generates ATS score and recommendations", () => {
    const jobDescription =
      "Buscamos soporte técnico con experiencia en Jira, redes y atención al cliente.";

    const result = analyzeResumeMatch(baseResume, jobDescription);

    expect(result.atsScore).toBeGreaterThanOrEqual(0);
    expect(result.atsScore).toBeLessThanOrEqual(100);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("handles empty job description gracefully", () => {
    const result = analyzeResumeMatch(baseResume, "");

    expect(result.keywords).toEqual([]);
    expect(result.matchPercentage).toBe(0);
  });

  it("matches keywords even with different word order", () => {
    const jobDescription = "planificación de construcción de puentes";

    const resume: ResumeData = {
      ...baseResume,
      experiences: [
        {
          id: "1",
          title: "Ingeniero",
          location: "CR",
          startDate: "2023",
          endDate: "2024",
          description: "Construcción de puentes y planificación de proyectos",
        },
      ],
    };

    const result = analyzeResumeMatch(resume, jobDescription);

    expect(result.matchPercentage).toBeGreaterThan(0);
  });

  it("always returns ATS score between 0 and 100", () => {
    const jobDescription = "cualquier texto";

    const result = analyzeResumeMatch(baseResume, jobDescription);

    expect(result.atsScore).toBeGreaterThanOrEqual(0);
    expect(result.atsScore).toBeLessThanOrEqual(100);
  });

  it("penalizes resumes with missing sections", () => {
    const emptyResume: ResumeData = {
      ...baseResume,
      summary: "",
      skills: [],
      experiences: [],
      education: [],
      projects: [],
    };

    const result = analyzeResumeMatch(emptyResume, "soporte tecnico");

    expect(result.sectionCompleteness).toBeLessThan(50);
  });

  it("generates recommendations when CV is weak", () => {
    const weakResume: ResumeData = {
      ...baseResume,
      summary: "",
      skills: [],
    };

    const result = analyzeResumeMatch(
      weakResume,
      "aws redes soporte tecnico jira"
    );

    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  
});