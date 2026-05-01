import type { ResumeData } from "../types/resume.types";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const STOPWORDS = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas",
  "de", "del", "a", "al", "en", "por", "para", "con", "sin",
  "y", "o", "u", "que", "se", "su", "sus", "tu", "tus",
  "es", "son", "ser", "estar", "esta", "este", "estos", "estas",
  "como", "mas", "muy", "entre", "sobre", "desde", "hacia",
  "lo", "le", "les", "nos", "nuestra", "nuestro", "nuestros",
  "nuestras", "tambien", "donde", "cuando", "quien", "cual",
  "pero", "todo", "solo", "cada", "aqui", "usando", "mediante",
  "traves", "dentro", "clara", "deseable", "beneficios",
  "intermedio", "alto", "busca", "buscamos", "estamos",
  "orientamos", "proyectos", "tareas", "excelentes", "excelente",
]);

const GENERIC_WORDS = new Set([
  "empresa", "equipo", "puesto", "rol", "candidato", "candidata",
  "ofrecemos", "oferta", "oportunidad", "crecimiento", "profesional",
  "unirse", "miembros", "clave", "capacidad", "demostrada",
  "multiples", "simultaneamente", "detallista", "experiencia",
  "conocimientos", "habilidades", "funciones", "descripcion", "anos",
  "años", "manejo", "dominio", "herramientas", "sector", "trabajo",
  "colaborar", "generar", "minimizar", "requisitos", "requisito",
  "perfil", "incorporarse", "responsabilidades", "responsabilidad",
  "funcion",
]);

const FIELD_TOKENS = new Set([
  "python", "sql", "aws", "react", "node", "forecasting", "retail",
  "demand", "sap", "powerbi", "tableau", "excel", "android", "redes",
  "jira", "litigio", "ventas", "soporte", "administracion", "contabilidad",
  "logistica", "inventario", "facturacion", "cliente", "clientes",
  "cocina", "alimentos", "seguridad", "hardware", "software",
]);

const BENEFIT_TERMS_REGEX =
  /horario|vacaciones|licencia|paternidad|maternidad|remoto|hibrido/i;

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type AtsRecommendation = {
  type: "keyword" | "section" | "format" | "alignment";
  message: string;
};

export type AtsMatchResult = {
  keywords: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  matchPercentage: number;
  sectionCompleteness: number;
  formatQuality: number;
  roleAlignment: number;
  atsScore: number;
  recommendations: AtsRecommendation[];
};

/* -------------------------------------------------------------------------- */
/* Text normalization                                                          */
/* -------------------------------------------------------------------------- */

export function normalizeWithBoundaries(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\n\r,;]/g, " . ")
    .replace(/[^a-z0-9+#. \s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isTrash(word: string): boolean {
  return (
    word.length <= 2 ||
    word === "." ||
    STOPWORDS.has(word) ||
    GENERIC_WORDS.has(word)
  );
}

function getRelevantTokens(text: string): string[] {
  return normalizeWithBoundaries(text)
    .split(/\s+/)
    .filter((word) => !isTrash(word));
}

/* -------------------------------------------------------------------------- */
/* Keyword extraction                                                          */
/* -------------------------------------------------------------------------- */

function createSmartNGrams(words: string[]): string[] {
  const candidates: string[] = [];

  for (const word of words) {
    if (word !== "." && (!isTrash(word) || FIELD_TOKENS.has(word))) {
      candidates.push(word);
    }
  }

  for (let n = 2; n <= 3; n += 1) {
    for (let i = 0; i < words.length - (n - 1); i += 1) {
      const slice = words.slice(i, i + n);

      if (slice.includes(".")) continue;
      if (isTrash(slice[0]) || isTrash(slice[n - 1])) continue;

      const stopwordCount = slice.filter((word) => STOPWORDS.has(word)).length;
      if (stopwordCount > 1) continue;

      candidates.push(slice.join(" "));
    }
  }

  return candidates;
}

function scoreTerm(term: string, frequency: number): number {
  const words = term.split(" ");
  let score = frequency * 2;

  if (words.length === 2) score += 5;
  if (words.length === 3) score += 8;

  for (const word of words) {
    if (FIELD_TOKENS.has(word)) score += 15;
  }

  if (BENEFIT_TERMS_REGEX.test(term)) score -= 10;

  return score;
}

function deduplicate(ranked: { term: string; score: number }[]): string[] {
  const result: { term: string; score: number }[] = [];

  const sorted = ranked.sort(
    (a, b) => b.score - a.score || b.term.length - a.term.length
  );

  for (const candidate of sorted) {
    const isRedundant = result.some(
      (item) =>
        item.term.includes(candidate.term) ||
        candidate.term.includes(item.term)
    );

    if (!isRedundant) {
      result.push(candidate);
    }
  }

  return result.map((item) => item.term);
}

export function getTopKeywords(jobDescription: string, limit = 10): string[] {
  const normalized = normalizeWithBoundaries(jobDescription);
  const rawWords = normalized.split(/\s+/);

  if (rawWords.length === 0) return [];

  const candidates = createSmartNGrams(rawWords);
  const frequencies = new Map<string, number>();

  for (const candidate of candidates) {
    frequencies.set(candidate, (frequencies.get(candidate) || 0) + 1);
  }

  const ranked = [...frequencies.entries()]
    .map(([term, frequency]) => ({
      term,
      score: scoreTerm(term, frequency),
    }))
    .filter((item) => item.score > 0);

  return deduplicate(ranked)
    .map((term) => term.replace(/\./g, "").trim())
    .filter((term) => term.length > 0)
    .slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* Resume text and matching                                                    */
/* -------------------------------------------------------------------------- */

export function buildResumeText(resumeData: ResumeData): string {
  return [
    resumeData.fullName,
    resumeData.summary,
    resumeData.skills.join(" "),
    resumeData.languages
      .map((language) => `${language.name} ${language.level}`)
      .join(" "),
    resumeData.experiences
      .map((experience) =>
        [experience.title, experience.location, experience.description].join(" ")
      )
      .join(" "),
    resumeData.education
      .map((education) => [education.institution, education.degree].join(" "))
      .join(" "),
    resumeData.projects
      .map((project) =>
        [project.name, project.technologies, project.description].join(" ")
      )
      .join(" "),
  ].join(" ");
}

function isKeywordMatched(keyword: string, resumeText: string): boolean {
  const keywordTokens = getRelevantTokens(keyword);
  const resumeTokens = new Set(getRelevantTokens(resumeText));

  if (keywordTokens.length === 0) return false;

  const matchedCount = keywordTokens.filter((token) =>
    resumeTokens.has(token)
  ).length;

  const matchRatio = matchedCount / keywordTokens.length;

  if (keywordTokens.length === 1) {
    return matchRatio === 1;
  }

  return matchRatio >= 0.6;
}

/* -------------------------------------------------------------------------- */
/* Scoring                                                                     */
/* -------------------------------------------------------------------------- */

function calculateSectionCompleteness(resumeData: ResumeData): number {
  const checks = [
    resumeData.summary.trim().length > 0,
    resumeData.experiences.some(
      (experience) =>
        experience.title.trim() ||
        experience.location.trim() ||
        experience.description.trim()
    ),
    resumeData.education.some(
      (education) => education.institution.trim() || education.degree.trim()
    ),
    resumeData.skills.length > 0,
    resumeData.projects.some(
      (project) =>
        project.name.trim() ||
        project.technologies.trim() ||
        project.description.trim()
    ),
  ];

  const completed = checks.filter(Boolean).length;

  return Math.round((completed / checks.length) * 100);
}

function calculateFormatQuality(resumeData: ResumeData): number {
  let score = 100;

  if (resumeData.summary.trim().length < 40) score -= 20;

  const hasWeakExperience = resumeData.experiences.some(
    (experience) =>
      experience.title.trim() &&
      experience.description.trim().length < 30
  );

  if (hasWeakExperience) score -= 20;

  if (resumeData.skills.length < 3) score -= 15;

  const hasEducation = resumeData.education.some(
    (education) => education.institution.trim() || education.degree.trim()
  );

  if (!hasEducation) score -= 15;

  return Math.max(score, 0);
}

function calculateRoleAlignment(matchPercentage: number): number {
  return matchPercentage;
}

function calculateFinalAtsScore(
  keywordMatch: number,
  sectionCompleteness: number,
  formatQuality: number,
  roleAlignment: number
): number {
  return Math.round(
    keywordMatch * 0.4 +
      sectionCompleteness * 0.2 +
      formatQuality * 0.2 +
      roleAlignment * 0.2
  );
}

/* -------------------------------------------------------------------------- */
/* Recommendations                                                             */
/* -------------------------------------------------------------------------- */

function generateRecommendations(
  resumeData: ResumeData,
  missingKeywords: string[],
  matchPercentage: number,
  sectionCompleteness: number,
  formatQuality: number,
  roleAlignment: number
): AtsRecommendation[] {
  const recommendations: AtsRecommendation[] = [];

  if (missingKeywords.length > 0) {
    recommendations.push({
      type: "keyword",
      message: `Agrega palabras clave relevantes de la oferta como: ${missingKeywords
        .slice(0, 5)
        .join(", ")}.`,
    });
  }

  if (!resumeData.summary.trim()) {
    recommendations.push({
      type: "section",
      message: "Agrega un resumen profesional alineado con la oferta laboral.",
    });
  }

  if (resumeData.skills.length < 3) {
    recommendations.push({
      type: "section",
      message:
        "Incluye al menos 3 habilidades relevantes para fortalecer la compatibilidad ATS.",
    });
  }

  const hasUsefulExperience = resumeData.experiences.some(
    (experience) =>
      experience.title.trim() ||
      experience.location.trim() ||
      experience.description.trim()
  );

  if (!hasUsefulExperience) {
    recommendations.push({
      type: "section",
      message:
        "Agrega experiencia laboral o proyectos relevantes relacionados con el puesto.",
    });
  }

  const hasShortExperienceDescription = resumeData.experiences.some(
    (experience) =>
      experience.title.trim() &&
      experience.description.trim().length < 40
  );

  if (hasShortExperienceDescription) {
    recommendations.push({
      type: "format",
      message:
        "Amplía las descripciones de experiencia con logros, responsabilidades y herramientas utilizadas.",
    });
  }

  if (matchPercentage < 50) {
    recommendations.push({
      type: "alignment",
      message:
        "El CV tiene baja coincidencia con la oferta. Ajusta el resumen y la experiencia usando términos del puesto.",
    });
  }

  if (sectionCompleteness < 80) {
    recommendations.push({
      type: "section",
      message:
        "Completa las secciones principales del CV para mejorar su estructura general.",
    });
  }

  if (formatQuality < 80) {
    recommendations.push({
      type: "format",
      message:
        "Mejora la calidad del contenido: evita secciones vacías y usa descripciones más completas.",
    });
  }

  if (roleAlignment < 60) {
    recommendations.push({
      type: "alignment",
      message:
        "Refuerza la alineación del perfil incluyendo experiencia, habilidades o proyectos más relacionados con la vacante.",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: "alignment",
      message:
        "Tu CV está bien alineado con la oferta. Revisa detalles finales antes de generar el PDF.",
    });
  }

  return recommendations.slice(0, 6);
}

/* -------------------------------------------------------------------------- */
/* Main ATS analysis                                                           */
/* -------------------------------------------------------------------------- */

export function analyzeResumeMatch(
  resumeData: ResumeData,
  jobDescription: string
): AtsMatchResult {
  const keywords = getTopKeywords(jobDescription, 12);
  const resumeText = buildResumeText(resumeData);

  const matchedKeywords = keywords.filter((keyword) =>
    isKeywordMatched(keyword, resumeText)
  );

  const missingKeywords = keywords.filter(
    (keyword) => !matchedKeywords.includes(keyword)
  );

  const matchPercentage =
    keywords.length > 0
      ? Math.round((matchedKeywords.length / keywords.length) * 100)
      : 0;

  const sectionCompleteness = calculateSectionCompleteness(resumeData);
  const formatQuality = calculateFormatQuality(resumeData);
  const roleAlignment = calculateRoleAlignment(matchPercentage);

  const atsScore = calculateFinalAtsScore(
    matchPercentage,
    sectionCompleteness,
    formatQuality,
    roleAlignment
  );

  const recommendations = generateRecommendations(
    resumeData,
    missingKeywords,
    matchPercentage,
    sectionCompleteness,
    formatQuality,
    roleAlignment
  );

  return {
    keywords,
    matchedKeywords,
    missingKeywords,
    matchPercentage,
    sectionCompleteness,
    formatQuality,
    roleAlignment,
    atsScore,
    recommendations,
  };
}