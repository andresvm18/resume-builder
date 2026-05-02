const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function buildSummaryPrompt({ resumeData, jobDescription }) {
  return `
Eres un asistente experto en currículums profesionales y optimización ATS.

Tu tarea es mejorar el resumen profesional del usuario.

Reglas:
- Escribe en español.
- Mantén un tono profesional, claro y natural.
- No inventes experiencia, empresas, títulos, certificaciones ni habilidades.
- Usa únicamente información del CV proporcionado.
- Si hay una oferta laboral, adapta el resumen a esa oferta.
- Máximo 4 líneas.
- No uses comillas.
- Devuelve únicamente el resumen optimizado.

CV:
Nombre: ${resumeData.fullName || ""}
Resumen actual: ${resumeData.summary || ""}
Habilidades: ${(resumeData.skills || []).join(", ")}

Experiencia:
${(resumeData.experiences || [])
  .map(
    (exp) =>
      `- ${exp.title || ""} ${exp.location || ""}: ${exp.description || ""}`
  )
  .join("\n")}

Oferta laboral:
${jobDescription || "No se proporcionó oferta laboral."}
`;
}

async function optimizeSummary({ resumeData, jobDescription }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = buildSummaryPrompt({
    resumeData,
    jobDescription,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return {
    optimizedSummary: response.text.trim(),
    source: "gemini",
    jobContextUsed: Boolean(jobDescription?.trim()),
  };
}

function buildRecommendationsPrompt({ resumeData, jobDescription, atsResult }) {
  return `
Eres un experto en currículums, reclutamiento y optimización ATS.

Analiza el CV, la oferta laboral y el resultado ATS actual.

Reglas:
- Escribe en español.
- Da recomendaciones claras, accionables y específicas.
- No inventes experiencia, empresas, certificaciones ni habilidades.
- Si sugieres agregar una keyword, aclara que debe agregarse solo si el usuario realmente tiene esa experiencia.
- Máximo 5 recomendaciones.
- Devuelve únicamente un JSON válido con esta forma:
{
  "recommendations": [
    "recomendación 1",
    "recomendación 2"
  ]
}

CV:
Nombre: ${resumeData.fullName || ""}
Resumen: ${resumeData.summary || ""}
Habilidades: ${(resumeData.skills || []).join(", ")}

Experiencia:
${(resumeData.experiences || [])
  .map(
    (exp) =>
      `- ${exp.title || ""} ${exp.location || ""}: ${exp.description || ""}`
  )
  .join("\n")}

Oferta laboral:
${jobDescription || "No se proporcionó oferta laboral."}

Resultado ATS actual:
Score: ${atsResult?.atsScore ?? "N/A"}
Keyword Match: ${atsResult?.matchPercentage ?? "N/A"}
Keywords encontradas: ${(atsResult?.matchedKeywords || []).join(", ")}
Keywords faltantes: ${(atsResult?.missingKeywords || []).join(", ")}
`;
}

function parseGeminiJson(text) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

async function generateAiRecommendations({
  resumeData,
  jobDescription,
  atsResult,
}) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = buildRecommendationsPrompt({
    resumeData,
    jobDescription,
    atsResult,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const parsed = parseGeminiJson(response.text);

  return {
    recommendations: parsed.recommendations || [],
    source: "gemini",
  };
}

module.exports = {
  optimizeSummary,
  generateAiRecommendations,
};