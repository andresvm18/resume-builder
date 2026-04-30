const request = require("supertest");
const app = require("../app");
const { prisma, pool } = require("../lib/prisma");

describe("Auth API", () => {
  const testEmail = `test-${Date.now()}@test.com`;

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

  it("registers a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: testEmail,
        password: "123456",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(testEmail);
  });

  it("logs in an existing user", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Login User",
        email: `login-${testEmail}`,
        password: "123456",
      });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: `login-${testEmail}`,
        password: "123456",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it("rejects invalid login credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "invalid@test.com",
        password: "wrong-password",
      });

    expect(response.statusCode).toBe(401);
  });
});