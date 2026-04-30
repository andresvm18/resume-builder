const request = require("supertest");
const app = require("../app");
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
});