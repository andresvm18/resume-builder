const PDF_TRANSLATIONS = {
  es: {
    sections: {
      experience: "EXPERIENCIA LABORAL",
      education: "EDUCACIÓN",
      skills: "HABILIDADES",
      languages: "IDIOMAS",
      projects: "PROYECTOS",
    },
    skills: {
      technical: "Habilidades técnicas",
      soft: "Habilidades blandas",
      fallbackTechnicalCategories: {
        software: "Tecnologías y desarrollo",
        data: "Análisis y reportería",
        healthcare: "Atención y procedimientos",
        construction: "Operaciones y ejecución",
        education: "Educación y formación",
        customerService: "Atención y servicio",
        logistics: "Logística y operaciones",
        administration: "Gestión y administración",
        marketing: "Marketing y comunicación",
        other: "Otras habilidades profesionales",
      },
      fallbackSoftDescriptions: {
        problemSolving:
          "Análisis de situaciones complejas para identificar causas y proponer soluciones efectivas.",
        proactivity:
          "Iniciativa para anticipar necesidades, optimizar procesos y mejorar resultados.",
        teamwork:
          "Colaboración efectiva con otras personas para alcanzar objetivos comunes.",
        adaptability:
          "Aprendizaje rápido de nuevas herramientas, procesos y entornos de trabajo.",
        communication:
          "Explicación clara de ideas, resultados o conceptos técnicos a distintas audiencias.",
        leadership:
          "Capacidad para orientar tareas, coordinar esfuerzos y apoyar la toma de decisiones.",
        analytical:
          "Interpretación de información y datos para detectar patrones, oportunidades y mejoras.",
        strategic:
          "Evaluación de información y objetivos para tomar decisiones alineadas al negocio.",
        organization:
          "Gestión ordenada de tareas, prioridades e información para cumplir objetivos.",
        detail:
          "Revisión cuidadosa de información para reducir errores y asegurar calidad.",
        timeManagement:
          "Administración eficiente de tareas y entregas dentro de plazos definidos.",
        empathy:
          "Interacción respetuosa y comprensión de necesidades en distintos contextos profesionales.",
        responsibility:
          "Cumplimiento consistente de tareas, procesos y compromisos asignados.",
        service:
          "Orientación a brindar apoyo y atención efectiva según las necesidades del entorno.",
        default:
          "Aplicación práctica demostrada en experiencias laborales, académicas o proyectos.",
      },
    },
    dates: {
      present: "Presente",
      estimated: "estimado",
      months: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
    },
    languageLevels: {
      Basic: "Básico",
      Intermediate: "Intermedio",
      Advanced: "Avanzado",
      Fluent: "Fluido",
      Native: "Nativo",
    },
  },

  en: {
    sections: {
      experience: "EXPERIENCE",
      education: "EDUCATION",
      skills: "SKILLS",
      languages: "LANGUAGES",
      projects: "PROJECTS",
    },
    skills: {
      technical: "Technical Skills",
      soft: "Soft Skills",
      fallbackTechnicalCategories: {
        software: "Technology and Development",
        data: "Data Analysis and Reporting",
        healthcare: "Care and Procedures",
        construction: "Operations and Execution",
        education: "Education and Training",
        customerService: "Customer Service",
        logistics: "Logistics and Operations",
        administration: "Management and Administration",
        marketing: "Marketing and Communication",
        other: "Other Professional Skills",
      },
      fallbackSoftDescriptions: {
        problemSolving:
          "Ability to analyze complex situations, identify causes, and propose effective solutions.",
        proactivity:
          "Initiative to anticipate needs, improve processes, and support better outcomes.",
        teamwork:
          "Effective collaboration with others to achieve shared goals.",
        adaptability:
          "Ability to quickly learn new tools, processes, and work environments.",
        communication:
          "Clear communication of ideas, results, or technical concepts to different audiences.",
        leadership:
          "Ability to guide tasks, coordinate efforts, and support decision-making.",
        analytical:
          "Interpretation of information and data to identify patterns, opportunities, and improvements.",
        strategic:
          "Evaluation of information and objectives to make decisions aligned with business needs.",
        organization:
          "Structured management of tasks, priorities, and information to meet objectives.",
        detail:
          "Careful review of information to reduce errors and ensure quality.",
        timeManagement:
          "Efficient management of tasks and deadlines within defined timeframes.",
        empathy:
          "Respectful interaction and understanding of needs across professional contexts.",
        responsibility:
          "Consistent fulfillment of assigned tasks, processes, and commitments.",
        service:
          "Focus on providing effective support and attention according to the environment’s needs.",
        default:
          "Practical application demonstrated through work experience, academic activities, or projects.",
      },
    },
    dates: {
      present: "Present",
      estimated: "estimated",
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
    languageLevels: {
      Basic: "Basic",
      Intermediate: "Intermediate",
      Advanced: "Advanced",
      Fluent: "Fluent",
      Native: "Native",
    },
  },
};

function normalizeResumeLanguage(language = "es") {
  return ["es", "en"].includes(language) ? language : "es";
}

function getPdfTranslations(language = "es") {
  return PDF_TRANSLATIONS[normalizeResumeLanguage(language)];
}

module.exports = {
  PDF_TRANSLATIONS,
  normalizeResumeLanguage,
  getPdfTranslations,
};