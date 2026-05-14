export const ATS_CONFIG = {
  MIN_KEYWORD_MATCH: 60,
  MIN_COMPLETENESS: 70,
  MIN_FORMAT_SCORE: 80,

  SCORE_LABELS: {
    EXCELLENT: "Excelente",
    GOOD: "Bueno",
    IMPROVABLE: "Mejorable",
    LOW: "Bajo",
  },
} as const;

export const ATS_DISCLAIMER =
  "La puntuación ATS es una estimación basada en coincidencia de palabras clave, estructura y contenido del CV.";