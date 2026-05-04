const { GoogleGenAI } = require("@google/genai");
const OpenAI = require("openai");

const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const openrouter = process.env.OPENROUTER_API_KEY
  ? new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "Resume ATS Builder",
    },
  })
  : null;

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

async function generateWithOpenRouter(prompt) {
  if (!openrouter) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const response = await openrouter.chat.completions.create({
    model: "openrouter/free",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  return {
    text: response.choices?.[0]?.message?.content || "",
    provider: "openrouter",
  };
}

async function generateWithGemini(prompt) {
  if (!gemini) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return {
    text: response.text,
    provider: "gemini",
  };
}

async function generateWithOpenAI(prompt) {
  if (!openai) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  return {
    text: response.choices?.[0]?.message?.content || "",
    provider: "openai",
  };
}

async function generateWithFallback(prompt) {
  const providers = [
    {
      name: "openrouter",
      run: () => generateWithOpenRouter(prompt),
    },
    {
      name: "gemini",
      run: () => generateWithGemini(prompt),
    },
    {
      name: "openai",
      run: () => generateWithOpenAI(prompt),
    },
  ];

  const errors = [];

  for (const provider of providers) {
    try {
      console.log(`🧠 Intentando con: ${provider.name}`);

      const result = await provider.run();

      if (!result.text || !result.text.trim()) {
        throw new Error(`${provider.name} returned empty response`);
      }

      console.log(`✅ Respuesta exitosa de: ${provider.name}`);

      return result;
    } catch (error) {
      errors.push({
        provider: provider.name,
        message: error.message,
      });

      if (process.env.NODE_ENV !== "production") {
        console.warn(`❌ ${provider.name} falló`);
      }
    }
  }

  const detail = errors
    .map((error) => `${error.provider}: ${error.message}`)
    .join(" | ");

  throw new Error(`All AI providers failed. ${detail}`);
}

function cleanJsonText(text = "") {
  let cleaned = String(text)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

function parseAiJson(text) {
  return JSON.parse(cleanJsonText(text));
}

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
  const result = await generateWithFallback(
    buildSummaryPrompt({
      resumeData,
      jobDescription,
    })
  );

  return {
    optimizedSummary: result.text.trim(),
    source: result.provider,
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

async function generateAiRecommendations({ resumeData, jobDescription }) {
  const result = await generateWithFallback(
    buildRecommendationsPrompt({
      resumeData,
      jobDescription,
    })
  );

  const parsed = parseAiJson(result.text);

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
    source: result.provider,
  };
}

function buildFullResumeOptimizationPrompt({ resumeData, jobDescription }) {
  return `
Eres un experto en currículums profesionales, redacción ATS y reclutamiento.

Tu tarea es optimizar el CV completo del usuario para la oferta laboral proporcionada.

Reglas estrictas:
- Escribe en español.
- No inventes experiencia, empresas, cargos, estudios, certificaciones ni habilidades.
- Conserva los datos personales exactamente iguales.
- Mejora redacción, claridad y alineación con la oferta.
- Usa palabras clave de la oferta solo si son coherentes con la información real del usuario.
- No agregues habilidades técnicas que no aparezcan o no se evidencien en el CV.
- No agregues habilidades blandas que no se puedan justificar con la experiencia, proyectos, educación o resumen del usuario.
- Cada descripción de habilidad blanda debe explicar por qué el usuario demuestra esa habilidad, no definir qué significa la habilidad.
- Las descripciones de habilidades blandas deben ser breves, profesionales y específicas.
- En experiencias laborales y proyectos, redacta los bullets en primera persona.
- Usa verbos como: generé, creé, desarrollé, implementé, apoyé, analicé, configuré, documenté, resolví, colaboré.
- No uses tercera persona como: generó, creó, desarrolló, implementó.
- En experiences.description y projects.description, cada bullet debe ir separado por un salto de línea usando \n.
- No devuelvas párrafos largos dentro de description.
- Cada responsabilidad o logro debe ser una oración independiente.
- No inventes logros, métricas, herramientas, empresas ni responsabilidades.
- Solo mejora la redacción usando la información existente.
- Si el texto original es simple, mejora claridad y profesionalismo sin agregar datos nuevos.
- Máximo 6 habilidades blandas.
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
    "technicalSkills": [
      {
        "category": "",
        "items": []
      }
    ],
    "softSkills": [
      {
        "name": "",
        "description": ""
      }
    ],
    "languages": [],
    "experiences": [],
    "education": [],
    "projects": [],
    "jobDescription": ""
  }
}

Ejemplo del estilo deseado para softSkills:
[
  {
    "name": "Resolución de problemas",
    "description": "Análisis y depuración de sistemas complejos."
  },
  {
    "name": "Proactividad",
    "description": "Iniciativa para optimizar procesos y asegurar calidad."
  },
  {
    "name": "Trabajo en equipo",
    "description": "Colaboración en entornos técnicos y académicos."
  }
]

CV original:
${JSON.stringify(resumeData, null, 2)}

Oferta laboral:
${jobDescription || "No se proporcionó oferta laboral."}
`;
}

function normalizeTechnicalSkills(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((group) => group && typeof group === "object")
    .map((group) => ({
      category: String(group.category || "").trim(),
      items: Array.isArray(group.items)
        ? group.items.map((item) => String(item).trim()).filter(Boolean)
        : [],
    }))
    .filter((group) => group.category && group.items.length);
}

function normalizeSoftSkills(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((skill) => skill && typeof skill === "object")
    .map((skill) => ({
      name: String(skill.name || "").trim(),
      description: String(skill.description || "").trim(),
    }))
    .filter((skill) => skill.name && skill.description);
}

function fallbackOptimizedResume(resumeData, jobDescription) {
  return {
    ...resumeData,
    fullName: resumeData.fullName,
    email: resumeData.email,
    phone: resumeData.phone,
    location: resumeData.location,
    skills: resumeData.skills || [],
    technicalSkills: [],
    softSkills: [],
    jobDescription,
  };
}

async function optimizeFullResume({ resumeData, jobDescription }) {
  try {
    const result = await generateWithFallback(
      buildFullResumeOptimizationPrompt({
        resumeData,
        jobDescription,
      })
    );

    const parsed = parseAiJson(result.text);
    const optimized = parsed.optimizedResumeData || {};

    return {
      optimizedResumeData: {
        ...resumeData,
        ...optimized,

        fullName: resumeData.fullName,
        email: resumeData.email,
        phone: resumeData.phone,
        location: resumeData.location,

        skills: Array.isArray(optimized.skills)
          ? optimized.skills
          : resumeData.skills || [],

        technicalSkills: normalizeTechnicalSkills(optimized.technicalSkills),
        softSkills: normalizeSoftSkills(optimized.softSkills),

        jobDescription,
      },
      source: result.provider,
    };
  } catch (error) {
    console.error("[AI fallback] optimizeFullResume failed:", error.message);

    return {
      optimizedResumeData: fallbackOptimizedResume(resumeData, jobDescription),
      source: "fallback",
    };
  }
}

function buildFinalAtsAnalysisPrompt({ resumeData, jobDescription }) {
  return `
Actúa como un sistema ATS profesional y reclutador técnico.

Tu tarea es analizar el CV final optimizado frente a la oferta laboral y devolver una calificación ATS.

Reglas:
- Escribe en español.
- Evalúa únicamente la información del CV y la oferta.
- No inventes experiencia, certificaciones, habilidades ni logros.
- Sé estricto pero útil.
- Devuelve únicamente JSON válido.
- No uses markdown.
- La calificación debe ser de 0 a 100.
- Máximo 5 fortalezas.
- Máximo 5 debilidades.
- Máximo 6 recomendaciones.

Formato exacto:
{
  "atsScore": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "matchedKeywords": [],
  "missingKeywords": [],
  "recommendations": []
}

CV final optimizado:
${JSON.stringify(resumeData, null, 2)}

Oferta laboral:
${jobDescription || "No se proporcionó oferta laboral."}
`;
}

async function analyzeFinalAts({ resumeData, jobDescription }) {
  const result = await generateWithFallback(
    buildFinalAtsAnalysisPrompt({
      resumeData,
      jobDescription,
    })
  );

  const parsed = parseAiJson(result.text);

  return {
    atsScore: Number(parsed.atsScore) || 0,
    summary: parsed.summary || "",
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    matchedKeywords: Array.isArray(parsed.matchedKeywords)
      ? parsed.matchedKeywords
      : [],
    missingKeywords: Array.isArray(parsed.missingKeywords)
      ? parsed.missingKeywords
      : [],
    recommendations: Array.isArray(parsed.recommendations)
      ? parsed.recommendations
      : [],
    source: result.provider,
  };
}

module.exports = {
  optimizeSummary,
  generateAiRecommendations,
  optimizeFullResume,
  analyzeFinalAts,
};