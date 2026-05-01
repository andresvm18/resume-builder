export type Experience = {
  id: number | string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Education = {
  id: number | string;
  institution: string;
  degree: string;
  date: string;
};

export type LanguageLevel =
  | "Basic"
  | "Intermediate"
  | "Advanced"
  | "Fluent"
  | "Native";

export type Language = {
  id: number | string;
  name: string;
  level: LanguageLevel;
};

export type Project = {
  id: number | string;
  name: string;
  technologies: string;
  description: string;
  link: string;
};

export type Step =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "languages"
  | "jobDescription";

export type StepItem = {
  id: Step;
  label: string;
  title: string;
  description: string;
};

export type ResumeData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  languages: Language[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  jobDescription: string;
};

export type ResumeVersion = {
  id: string;
  data: unknown; // 👈 en vez de any
  createdAt: string;
};

export type Resume = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  versions: ResumeVersion[];
};


export const DEFAULT_RESUME_DATA: ResumeData = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  skills: [],
  languages: [
    {
      id: Date.now(),
      name: "",
      level: "Advanced",
    },
  ],
  experiences: [
    {
      id: Date.now(),
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
  education: [
    {
      id: Date.now(),
      institution: "",
      degree: "",
      date: "",
    },
  ],
  projects: [
    {
      id: Date.now(),
      name: "",
      technologies: "",
      description: "",
      link: "",
    },
  ],
  jobDescription: "",
};

export const RESUME_STEPS: StepItem[] = [
  {
    id: "personal",
    label: "Personal",
    title: "Información Personal",
    description: "Tus datos de contacto básicos",
  },
  {
    id: "summary",
    label: "Perfil",
    title: "Perfil Profesional",
    description: "Un resumen atractivo de tu carrera",
  },
  {
    id: "experience",
    label: "Experiencia",
    title: "Experiencia Laboral",
    description: "Tu trayectoria profesional",
  },
  {
    id: "education",
    label: "Educación",
    title: "Formación Académica",
    description: "Tu historial educativo",
  },
  {
    id: "skills",
    label: "Habilidades",
    title: "Habilidades",
    description: "Tecnologías y herramientas que dominas",
  },
  {
    id: "projects",
    label: "Proyectos",
    title: "Proyectos",
    description: "Tus mejores trabajos",
  },
];