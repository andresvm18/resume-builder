jest.mock("../services/ai/ai.providers", () => ({
  generateWithFallback: jest.fn(),
}));

const { generateWithFallback } = require("../services/ai/ai.providers");
const { optimizeFullResume } = require("../services/ai/ai.service");
const {
  buildFullResumeOptimizationPrompt,
} = require("../services/ai/prompts/optimize-resume.prompt");

describe("AI language propagation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("builds a different prompt for es vs en", () => {
    const esPrompt = buildFullResumeOptimizationPrompt({
      resumeData: { fullName: "Ana" },
      jobDescription: "Dev",
      language: "es",
    });

    const enPrompt = buildFullResumeOptimizationPrompt({
      resumeData: { fullName: "Ana" },
      jobDescription: "Dev",
      language: "en",
    });

    expect(esPrompt).toContain("Escribe completamente en español");
    expect(enPrompt).toContain("Write entirely in English");
    expect(esPrompt).not.toEqual(enPrompt);
  });

  it("forces language='en' onto the optimized resume even though the AI response never includes it", async () => {
    generateWithFallback.mockResolvedValue({
      text: JSON.stringify({
        optimizedResumeData: { summary: "Optimized summary" },
      }),
      provider: "mock",
    });

    const result = await optimizeFullResume({
      resumeData: { fullName: "Ana", email: "ana@test.com" }, // no language field
      jobDescription: "Dev",
      language: "en",
    });

    expect(result.optimizedResumeData.language).toBe("en");

    const sentPrompt = generateWithFallback.mock.calls[0][0];
    expect(sentPrompt).toContain("Write entirely in English");
  });

  it("defaults to language='es' when none is passed", async () => {
    generateWithFallback.mockResolvedValue({
      text: JSON.stringify({
        optimizedResumeData: { summary: "Resumen optimizado" },
      }),
      provider: "mock",
    });

    const result = await optimizeFullResume({
      resumeData: { fullName: "Ana", email: "ana@test.com" },
      jobDescription: "Dev",
    });

    expect(result.optimizedResumeData.language).toBe("es");
  });
});