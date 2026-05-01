/**
 * NLP Engine
 */


import type { ResumeData } from "../types/resume.types";

// Set of common stopwords to filter out
const STOPWORDS = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "a", "al", "en", "por", "para", "con", "sin",
  "y", "o", "u", "que", "se", "su", "sus", "tu", "tus", "es", "son", "ser", "estar", "esta", "este", "estos", "estas",
  "como", "mas", "muy", "entre", "sobre", "desde", "hacia", "lo", "le", "les", "nos", "nuestra", "nuestro", "nuestros",
  "nuestras", "tambien", "donde", "cuando", "quien", "cual", "pero", "todo", "solo", "cada", "aqui", "sobre",
  "usando", "mediante", "traves", "dentro", "hacia", "clara", "deseable", "beneficios", "intermedio", "alto", "busca", "buscamos",
  "estamos", "orientamos", "proyectos", "tareas", "nuestro", "nuestra", "excelentes", "excelente"
]);

// Set of generic, low-value words commonly found in job descriptions
const GENERIC_WORDS = new Set([
  "empresa", "equipo", "puesto", "rol", "candidato", "candidata", "ofrecemos", "oferta", "oportunidad",
  "crecimiento", "profesional", "unirse", "miembros", "clave", "capacidad", "demostrada", "multiples", "simultaneamente",
  "detallista", "experiencia", "conocimientos", "habilidades", "funciones", "descripcion", "años", "manejo", "dominio",
  "herramientas", "sector", "trabajo", "colaborar", "generar", "minimizar", "requisitos", "perfil", "incorporarse"
]);

// List of high-value domain-specific tokens (expandable by area)
const FIELD_TOKENS = new Set([
  "python", "sql", "aws", "react", "node", "forecasting", "retail", "demand",
  "sap", "powerbi", "tableau", "excel", "android", "redes", "jira", "litigio", "ventas"
]);


/**
 * Normalizes text while preserving the period as a logical boundary marker
 */
export function normalizeWithBoundaries(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Remove diacritics
    // Convert newlines, commas, and semicolons to period boundaries
    .replace(/[\n\r,;]/g, " . ")
    // Keep only letters, numbers, IT symbols, and our period boundary
    .replace(/[^a-z0-9+#. \s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Checks if a word is irrelevant (short, stopword, generic, or a period)
function isTrash(word: string): boolean {
  return word.length <= 2 || STOPWORDS.has(word) || GENERIC_WORDS.has(word) || word === ".";
}

// Generates unigrams and smart n-grams (2-3 words) that don't cross period boundaries
function createSmartNGrams(words: string[]): string[] {
  const candidates: string[] = [];

  // 1. Unigrams (significant standalone words)
  words.forEach(w => {
    if (w !== "." && (!isTrash(w) || FIELD_TOKENS.has(w))) {
      candidates.push(w);
    }
  });

  // 2. N-Grams (2-3 words)
  for (let n = 2; n <= 3; n++) {
    for (let i = 0; i < words.length - (n - 1); i++) {
      const slice = words.slice(i, i + n);

      // BLOCK: If the group crosses a period, it's not a valid phrase
      if (slice.includes(".")) continue;

      // BLOCK: Start and end must have lexical weight
      if (isTrash(slice[0]) || isTrash(slice[n - 1])) continue;

      // Density filter: at most one internal stopword (e.g., "gestión DE proyectos")
      const trashCount = slice.filter(w => STOPWORDS.has(w)).length;
      if (trashCount > 1) continue;

      candidates.push(slice.join(" "));
    }
  }
  return candidates;
}

// Scores a term based on frequency, length (compound concept bonus), and field token matches
function scoreTerm(term: string, frequency: number): number {
  const words = term.split(" ");
  let score = frequency * 2;

  // Bonus for compound concepts
  if (words.length === 2) score += 5;
  if (words.length === 3) score += 8;

  // Bonus for high-value dictionary matches
  words.forEach(w => {
    if (FIELD_TOKENS.has(w)) score += 15;
  });

  return score;
}

// Removes redundant terms (shorter contained within longer or vice versa) and penalizes common benefits
function deduplicate(ranked: { term: string, score: number }[]): string[] {
  const result: { term: string, score: number }[] = [];

  // Sort: first by score, then by term length descending
  const sorted = ranked.sort((a, b) => b.score - a.score || b.term.length - a.term.length);

  for (const candidate of sorted) {
    // Manual penalty for common benefits so they don't overshadow technical terms
    const isBenefit = /horario|vacaciones|licencia|paternidad|maternidad|remoto/.test(candidate.term);
    if (isBenefit) candidate.score -= 10;

    // Check for redundancy: one term contains the other
    const isRedundant = result.some(item =>
      item.term.includes(candidate.term) || candidate.term.includes(item.term)
    );

    if (!isRedundant) {
      result.push(candidate);
    }
  }
  return result.map(r => r.term);
}

// Main export: extracts top keywords from a job description
export function getTopKeywords(jobDescription: string, limit = 10): string[] {
  const normalized = normalizeWithBoundaries(jobDescription);
  const rawWords = normalized.split(/\s+/);

  if (rawWords.length === 0) return [];

  const candidates = createSmartNGrams(rawWords);
  const frequencies = new Map<string, number>();

  candidates.forEach(c => frequencies.set(c, (frequencies.get(c) || 0) + 1));

  const ranked = [...frequencies.entries()]
    .map(([term, freq]) => ({ term, score: scoreTerm(term, freq) }))
    .filter(item => item.score > 0); // Filter out negative scores if any

  const cleanList = deduplicate(ranked);

  // Final cleanup: remove stray periods and apply limit
  return cleanList
    .map(t => t.replace(/\./g, "").trim())
    .filter(t => t.length > 0)
    .slice(0, limit);
}

export type AtsMatchResult = {
  keywords: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  matchPercentage: number;
};

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
        [
          experience.title,
          experience.location,
          experience.description,
        ].join(" ")
      )
      .join(" "),
    resumeData.education
      .map((education) =>
        [
          education.institution,
          education.degree,
        ].join(" ")
      )
      .join(" "),
    resumeData.projects
      .map((project) =>
        [
          project.name,
          project.technologies,
          project.description,
        ].join(" ")
      )
      .join(" "),
  ].join(" ");
}

function getRelevantTokens(text: string): string[] {
  return normalizeWithBoundaries(text)
    .split(/\s+/)
    .filter((word) => {
      return (
        word.length > 2 &&
        word !== "." &&
        !STOPWORDS.has(word) &&
        !GENERIC_WORDS.has(word)
      );
    });
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

  return {
    keywords,
    matchedKeywords,
    missingKeywords,
    matchPercentage,
  };
}
