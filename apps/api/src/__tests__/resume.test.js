jest.mock("child_process", () => ({
  execFile: jest.fn((command, args, callback) => {
    callback(null, "", "");
  }),
}));

const request = require("supertest");
const app = require("../app");
const fs = require("fs/promises");
const { prisma, pool } = require("../lib/prisma");

async function createTestUserAndToken() {
  const email = `resume-${Date.now()}@test.com`;

  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Resume Test User",
      email,
      password: "123456",
    });

  return {
    token: response.body.token,
    user: response.body.user,
  };
}

describe("Resume API", () => {
  afterEach(async () => {
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

  it("returns resumes for authenticated user", async () => {
    const { token, user } = await createTestUserAndToken();

    const resume = await prisma.resume.create({
      data: {
        title: "Test Resume",
        userId: user.id,
      },
    });

    await prisma.resumeVersion.create({
      data: {
        resumeId: resume.id,
        data: {
          fullName: "Test User",
          email: "test@test.com",
          summary: "Test summary",
        },
      },
    });

    const response = await request(app)
      .get("/api/resume")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("Test Resume");
    expect(response.body[0].versions).toHaveLength(1);
  });

  it("rejects resume list without token", async () => {
    const response = await request(app).get("/api/resume");

    expect(response.statusCode).toBe(401);
  });

  it("deletes a resume owned by authenticated user", async () => {
    const { token, user } = await createTestUserAndToken();

    const resume = await prisma.resume.create({
      data: {
        title: "Resume To Delete",
        userId: user.id,
      },
    });

    const response = await request(app)
      .delete(`/api/resume/${resume.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    const deletedResume = await prisma.resume.findUnique({
      where: { id: resume.id },
    });

    expect(deletedResume).toBeNull();
  });

  it("generates a resume PDF for authenticated user", async () => {
    const { token } = await createTestUserAndToken();

    jest.spyOn(fs, "readFile").mockImplementation(async (filePath) => {
      if (String(filePath).endsWith(".tex")) {
        return `
        {{FULL_NAME}}
        {{EMAIL}}
        {{PHONE}}
        {{LOCATION}}
        {{SUMMARY}}
        {{EDUCATION}}
        {{EXPERIENCE}}
        {{SKILLS}}
        {{LANGUAGES}}
        {{PROJECTS}}
      `;
      }

      return Buffer.from("fake-pdf");
    });

    jest.spyOn(fs, "writeFile").mockResolvedValue();
    jest.spyOn(fs, "mkdir").mockResolvedValue();
    jest.spyOn(fs, "unlink").mockResolvedValue();

    const response = await request(app)
      .post("/api/resume/generate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullName: "Test User",
        email: "test@test.com",
        phone: "123456",
        location: "Costa Rica",
        summary: "Professional summary",
        skills: ["React", "Node.js"],
        languages: [
          {
            id: "1",
            name: "Spanish",
            level: "Native",
          },
        ],
        experiences: [],
        education: [],
        projects: [],
      });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("application/pdf");
    expect(response.body).toBeDefined();

    const resumes = await prisma.resume.findMany();

    expect(resumes).toHaveLength(1);
    expect(resumes[0].title).toBe("Test User");

    jest.restoreAllMocks();
  });

  it("returns a specific resume by id for authenticated user", async () => {
    const { token, user } = await createTestUserAndToken();

    const resume = await prisma.resume.create({
      data: {
        title: "Resume By ID",
        userId: user.id,
      },
    });

    await prisma.resumeVersion.create({
      data: {
        resumeId: resume.id,
        data: {
          fullName: "Test User",
          email: "test@test.com",
          summary: "Test summary",
        },
      },
    });

    const response = await request(app)
      .get(`/api/resume/${resume.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(resume.id);
    expect(response.body.title).toBe("Resume By ID");
    expect(response.body.versions).toHaveLength(1);
  });

  it("returns 404 if resume does not belong to user", async () => {
    const { token } = await createTestUserAndToken();

    const fakeId = "00000000-0000-0000-0000-000000000000";

    const response = await request(app)
      .get(`/api/resume/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
  });
});