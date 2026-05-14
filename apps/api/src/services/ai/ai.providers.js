const { GoogleGenAI } = require("@google/genai");
const OpenAI = require("openai");
const logger = require("../../utils/logger");

const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const openrouter = process.env.OPENROUTER_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
        "X-Title": "Resume ATS Builder",
      },
    })
  : null;

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

async function generateWithOpenRouter(prompt) {
  if (!openrouter) throw new Error("OPENROUTER_API_KEY is not configured");

  const response = await openrouter.chat.completions.create({
    model: "openrouter/free",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.35,
  });

  return {
    text: response.choices?.[0]?.message?.content || "",
    provider: "openrouter",
  };
}

async function generateWithGemini(prompt) {
  if (!gemini) throw new Error("GEMINI_API_KEY is not configured");

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
  if (!openai) throw new Error("OPENAI_API_KEY is not configured");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.35,
  });

  return {
    text: response.choices?.[0]?.message?.content || "",
    provider: "openai",
  };
}

async function generateWithFallback(prompt) {
  const providers = [
    { name: "openrouter", run: () => generateWithOpenRouter(prompt) },
    { name: "gemini", run: () => generateWithGemini(prompt) },
    { name: "openai", run: () => generateWithOpenAI(prompt) },
  ];

  const errors = [];

  for (const provider of providers) {
    try {
      logger.info("AI", "Trying AI provider", { provider: provider.name });

      const result = await provider.run();

      if (!result.text || !result.text.trim()) {
        throw new Error(`${provider.name} returned empty response`);
      }

      logger.info("AI", "AI provider succeeded", { provider: provider.name });

      return result;
    } catch (error) {
      errors.push({
        provider: provider.name,
        message: error.message,
      });

      if (process.env.NODE_ENV !== "production") {
        logger.warn("AI", "AI provider failed", {
          provider: provider.name,
          message: error.message,
        });
      }
    }
  }

  const detail = errors
    .map((error) => `${error.provider}: ${error.message}`)
    .join(" | ");

  throw new Error(`All AI providers failed. ${detail}`);
}

module.exports = {
  generateWithFallback,
};