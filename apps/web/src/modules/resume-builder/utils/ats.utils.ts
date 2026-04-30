const STOPWORDS = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas",
  "de", "del", "a", "al", "en", "por", "para", "con", "sin",
  "y", "o", "u", "que", "se", "su", "sus", "tu", "tus",
  "es", "son", "ser", "estar", "esta", "este", "estos", "estas",
  "como", "más", "mas", "muy", "entre", "sobre", "desde",
  "empresa", "puesto", "rol", "candidato", "candidata",
  "buscamos", "requiere", "requerimos", "ofrecemos",
  "experiencia", "conocimiento", "conocimientos",
]);

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

export function tokenize(text: string): string[] {
  return text.split(/\s+/).filter((word) => word.length > 2);
}

export function removeStopwords(words: string[]): string[] {
  return words.filter((word) => !STOPWORDS.has(word));
}

export function countFrequencies(words: string[]): Record<string, number> {
  return words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function getTopKeywords(
  jobDescription: string,
  limit = 12
): string[] {
  const normalized = normalizeText(jobDescription);
  const tokens = tokenize(normalized);
  const filtered = removeStopwords(tokens);
  const frequencies = countFrequencies(filtered);

  return Object.entries(frequencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}