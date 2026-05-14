const MONTHS_ES = [
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
];

const LANGUAGE_LEVELS_ES = {
  Basic: "Básico",
  Intermediate: "Intermedio",
  Advanced: "Avanzado",
  Fluent: "Fluido",
  Native: "Nativo",
};

const SOFT_SKILLS = [
  "comunicación",
  "comunicacion",
  "comunicación asertiva",
  "comunicacion asertiva",
  "trabajo en equipo",
  "liderazgo",
  "pensamiento analítico",
  "pensamiento analitico",
  "pensamiento estratégico",
  "pensamiento estrategico",
  "resolución de problemas",
  "resolucion de problemas",
  "proactividad",
  "adaptabilidad",
  "organización",
  "organizacion",
  "atención al detalle",
  "atencion al detalle",
  "gestión del tiempo",
  "gestion del tiempo",
];

const ALLOWED_TEMPLATES = new Set(["classic", "modern", "compact"]);

module.exports = {
  MONTHS_ES,
  LANGUAGE_LEVELS_ES,
  SOFT_SKILLS,
  ALLOWED_TEMPLATES,
};