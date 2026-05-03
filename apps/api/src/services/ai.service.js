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

function buildRecommendationsPrompt({ resumeData, jobDescription }) {
  return `
Eres un experto en reclutamiento, currículums y optimización ATS.

Analiza la oferta laboral y el CV del usuario.

Tu tarea:
1. Extraer palabras clave importantes de la oferta laboral.
2. Clasificarlas por categoría.
3. Compararlas contra el CV del usuario.
4. Identificar palabras clave presentes y faltantes.
5. Generar recomendaciones claras y accionables.

Reglas:
- Escribe en español.
- No inventes experiencia, certificaciones, empresas ni habilidades.
- Si una keyword falta, recomienda agregarla solo si el usuario realmente tiene esa experiencia.
- No uses markdown.
- Devuelve únicamente JSON válido.
- Máximo 8 keywords por categoría.
- Máximo 6 recomendaciones.

Formato exacto:
{
  "keywords": {
    "technical": [],
    "softSkills": [],
    "certifications": [],
    "responsibilities": []
  },
  "matchedKeywords": [],
  "missingKeywords": [],
  "recommendations": []
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

Educación:
${(resumeData.education || [])
      .map((edu) => `- ${edu.degree || ""} ${edu.institution || ""}`)
      .join("\n")}

Proyectos:
${(resumeData.projects || [])
      .map(
        (project) =>
          `- ${project.name || ""}: ${project.technologies || ""} ${project.description || ""}`
      )
      .join("\n")}

Oferta laboral:
${jobDescription || ""}
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
}) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = buildRecommendationsPrompt({
    resumeData,
    jobDescription,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const parsed = parseGeminiJson(response.text);

  return {
    keywords: {
      technical: parsed.keywords?.technical || [],
      softSkills: parsed.keywords?.softSkills || [],
      certifications: parsed.keywords?.certifications || [],
      responsibilities: parsed.keywords?.responsibilities || [],
    },
    matchedKeywords: parsed.matchedKeywords || [],
    missingKeywords: parsed.missingKeywords || [],
    recommendations: parsed.recommendations || [],
    source: "gemini",
  };
}

function buildFullResumeOptimizationPrompt({ resumeData, jobDescription }) {
  return `
Eres un experto en currículums profesionales, redacción ATS y reclutamiento.

Tu tarea es optimizar el CV completo del usuario para la oferta laboral proporcionada.

Reglas estrictas:
- Escribe en español.
- No inventes experiencia, empresas, cargos, estudios, certificaciones ni habilidades.
- Conserva la estructura original del CV.
- Mejora redacción, claridad y alineación con la oferta.
- Usa palabras clave de la oferta solo si son coherentes con la información del usuario.
- Mantén los datos personales exactamente iguales.
- Devuelve únicamente JSON válido.
- No uses markdown.
- No expliques nada fuera del JSON.

Formato exacto de respuesta:
{
  "optimizedResumeData": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "summary": "",
    "skills": [],
    "languages": [],
    "experiences": [],
    "education": [],
    "projects": [],
    "jobDescription": ""
  }
}

CV original:
${JSON.stringify(resumeData, null, 2)}

Oferta laboral:
${jobDescription || "No se proporcionó oferta laboral."}
`;
}

async function optimizeFullResume({ resumeData, jobDescription }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = buildFullResumeOptimizationPrompt({
    resumeData,
    jobDescription,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const parsed = parseGeminiJson(response.text);

  return {
    optimizedResumeData: {
      ...resumeData,
      ...parsed.optimizedResumeData,
      fullName: resumeData.fullName,
      email: resumeData.email,
      phone: resumeData.phone,
      location: resumeData.location,
      jobDescription,
    },
    source: "gemini",
  };
}

module.exports = {
  optimizeSummary,
  generateAiRecommendations,
  optimizeFullResume,
};