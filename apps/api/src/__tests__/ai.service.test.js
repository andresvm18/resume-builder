beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("AI Service", () => {
  beforeEach(() => {
    jest.resetModules();

    delete process.env.OPENROUTER_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.OPENAI_API_KEY;
  });

  it("returns fallback resume when all AI providers fail during full optimization", async () => {
    const { optimizeFullResume } = require("../services/ai.service");

    const resumeData = {
      fullName: "Test User",
      email: "test@test.com",
      phone: "123456",
      location: "Costa Rica",
      summary: "Original summary",
      skills: ["React"],
    };

    const result = await optimizeFullResume({
      resumeData,
      jobDescription: "React developer",
    });

    expect(result.source).toBe("fallback");
    expect(result.optimizedResumeData.fullName).toBe("Test User");
    expect(result.optimizedResumeData.email).toBe("test@test.com");
    expect(result.optimizedResumeData.skills).toEqual(["React"]);
  });
});