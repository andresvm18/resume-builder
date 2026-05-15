jest.mock("../services/ai.service", () => ({
  optimizeSummary: jest.fn(),
  generateAiRecommendations: jest.fn(),
  optimizeFullResume: jest.fn(),
  analyzeFinalAts: jest.fn(),
}));

const request = require("supertest");
const app = require("../app");
const { prisma, pool } = require("../lib/prisma");

const {
  optimizeSummary,
  generateAiRecommendations,
  optimizeFullResume,
  analyzeFinalAts,
} = require("../services/ai.service");

async function createTestUserAndToken() {
  const email = `ai-${Date.now()}@test.com`;

  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: "AI Test User",
      email,
      password: "Test1234",
    });

  return {
    token: response.body.token,
    user: response.body.user,
  };
}

describe("AI API", () => {
  afterEach(async () => {
    jest.clearAllMocks();

    await prisma.resumeVersion.deleteMany();
    await prisma.resume.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "@test.com",
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

  it("rejects optimize summary without token", async () => {
    const response = await request(app)
      .post("/api/ai/optimize-summary")
      .send({
        resumeData: {
          fullName: "Test User",
        },
      });

    expect(response.statusCode).toBe(401);
  });

  it("optimizes summary for authenticated user", async () => {
    const { token } = await createTestUserAndToken();

    optimizeSummary.mockResolvedValue({
      optimizedSummary: "Resumen optimizado",
      source: "mock",
      jobContextUsed: true,
    });

    const response = await request(app)
      .post("/api/ai/optimize-summary")
      .set("Authorization", `Bearer ${token}`)
      .send({
        resumeData: {
          fullName: "Test User",
          summary: "Resumen original",
          skills: ["React"],
        },
        jobDescription: "Frontend developer",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.optimizedSummary).toBe("Resumen optimizado");
    expect(optimizeSummary).toHaveBeenCalledTimes(1);
  });

  it("rejects recommendations without jobDescription", async () => {
    const { token } = await createTestUserAndToken();

    const response = await request(app)
      .post("/api/ai/recommendations")
      .set("Authorization", `Bearer ${token}`)
      .send({
        resumeData: {
          fullName: "Test User",
        },
      });

    expect(response.statusCode).toBe(400);
  });

  it("generates AI recommendations", async () => {
    const { token } = await createTestUserAndToken();

    generateAiRecommendations.mockResolvedValue({
      keywords: {
        technical: ["React"],
        softSkills: ["Comunicación"],
        certifications: [],
        responsibilities: ["Soporte técnico"],
      },
      matchedKeywords: ["React"],
      missingKeywords: ["Node.js"],
      recommendations: ["Agregá Node.js solo si tenés experiencia real."],
      source: "mock",
    });

    const response = await request(app)
      .post("/api/ai/recommendations")
      .set("Authorization", `Bearer ${token}`)
      .send({
        resumeData: {
          fullName: "Test User",
          skills: ["React"],
        },
        jobDescription: "React Node.js support",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.matchedKeywords).toContain("React");
    expect(response.body.missingKeywords).toContain("Node.js");
  });

  it("optimizes full resume", async () => {
    const { token } = await createTestUserAndToken();

    optimizeFullResume.mockResolvedValue({
      optimizedResumeData: {
        fullName: "Test User",
        email: "test@test.com",
        summary: "Resumen optimizado",
        skills: ["React"],
      },
      source: "mock",
    });

    const response = await request(app)
      .post("/api/ai/optimize-resume")
      .set("Authorization", `Bearer ${token}`)
      .send({
        resumeData: {
          fullName: "Test User",
          email: "test@test.com",
          summary: "Resumen original",
          skills: ["React"],
        },
        jobDescription: "React developer",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.optimizedResumeData.summary).toBe("Resumen optimizado");
  });

  it("rejects final ATS analysis without jobDescription", async () => {
    const { token } = await createTestUserAndToken();

    const response = await request(app)
      .post("/api/ai/final-ats-analysis")
      .set("Authorization", `Bearer ${token}`)
      .send({
        resumeData: {
          fullName: "Test User",
        },
      });

    expect(response.statusCode).toBe(400);
  });

  it("analyzes final ATS score", async () => {
    const { token } = await createTestUserAndToken();

    analyzeFinalAts.mockResolvedValue({
      atsScore: 85,
      summary: "Buen match",
      strengths: ["React"],
      weaknesses: ["Falta Node.js"],
      matchedKeywords: ["React"],
      missingKeywords: ["Node.js"],
      recommendations: ["Mejorar experiencia backend"],
      source: "mock",
    });

    const response = await request(app)
      .post("/api/ai/final-ats-analysis")
      .set("Authorization", `Bearer ${token}`)
      .send({
        resumeData: {
          fullName: "Test User",
          skills: ["React"],
        },
        jobDescription: "React Node.js developer",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.atsScore).toBe(85);
    expect(response.body.matchedKeywords).toContain("React");
  });
});