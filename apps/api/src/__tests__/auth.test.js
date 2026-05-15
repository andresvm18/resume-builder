const request = require("supertest");
const app = require("../app");
const { prisma, pool } = require("../lib/prisma");

describe("Auth API", () => {
  const testEmail = `test-${Date.now()}@test.com`;
  const validPassword = "Test1234";

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
        password: validPassword,
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
        password: validPassword,
      });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: `login-${testEmail}`,
        password: validPassword,
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

  it("rejects registration with missing fields", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: "missing@test.com",
        password: validPassword,
      });

    expect(response.statusCode).toBe(400);
  });

  it("rejects duplicated email registration", async () => {
    const email = `duplicate-${Date.now()}@test.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Duplicate User",
        email,
        password: validPassword,
      });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Duplicate User",
        email,
        password: validPassword,
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe("Email already exists");
  });

  it("rejects login with missing fields", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@test.com",
      });

    expect(response.statusCode).toBe(400);
  });

  it("returns current authenticated user", async () => {
    const email = `me-${Date.now()}@test.com`;

    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Me User",
        email,
        password: validPassword,
      });

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${registerResponse.body.token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user.email).toBe(email);
    expect(response.body.user.password).toBeUndefined();
  });

  it("rejects /me with invalid token", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalid-token");

    expect(response.statusCode).toBe(401);
  });
});