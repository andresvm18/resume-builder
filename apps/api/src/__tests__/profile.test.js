const request = require("supertest");
const app = require("../app");
const { prisma, pool } = require("../lib/prisma");

async function createAuthUser() {
  const email = `profile-${Date.now()}@test.com`;
  const password = "Password123";

  const registerResponse = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Profile Test User",
      email,
      password,
    });

  return {
    token: registerResponse.body.token,
    user: registerResponse.body.user,
  };
}

describe("Profile API", () => {
  beforeEach(async () => {
    await prisma.userProfile.deleteMany();
    await prisma.resumeVersion.deleteMany();
    await prisma.resume.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

  it("returns an empty normalized profile when user has no profile", async () => {
    const { token } = await createAuthUser();

    const response = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.profileData).toBeDefined();
    expect(response.body.profileData.fullName).toBe("");
    expect(response.body.profileData.skills).toEqual([]);
    expect(response.body.profileData.experiences).toEqual([]);
    expect(response.body.profileData.certifications).toEqual([]);
    expect(response.body.profileData.links).toEqual([]);
    expect(response.body.profileData.targetRoles).toEqual([]);
  });

  it("creates a user profile", async () => {
    const { token } = await createAuthUser();

    const response = await request(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        profileData: {
          fullName: "Andrés Víquez",
          email: "andres@test.com",
          summary: "Software Engineer",
          skills: ["React", "Node.js"],
          certifications: ["AWS Cloud Practitioner"],
          links: ["https://github.com/andresvm18"],
          targetRoles: ["Software Engineer"],
        },
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.profileData.fullName).toBe("Andrés Víquez");
    expect(response.body.profileData.skills).toContain("React");
    expect(response.body.profileData.certifications).toContain(
      "AWS Cloud Practitioner"
    );
  });

  it("updates an existing user profile instead of creating duplicates", async () => {
    const { token } = await createAuthUser();

    await request(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        profileData: {
          fullName: "Initial Name",
          skills: ["React"],
        },
      });

    const response = await request(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        profileData: {
          fullName: "Updated Name",
          skills: ["React", "TypeScript"],
        },
      });

    const count = await prisma.userProfile.count();

    expect(response.statusCode).toBe(200);
    expect(count).toBe(1);
    expect(response.body.profileData.fullName).toBe("Updated Name");
    expect(response.body.profileData.skills).toEqual(["React", "TypeScript"]);
  });

  it("requires authentication", async () => {
    const response = await request(app).get("/api/profile");

    expect(response.statusCode).toBe(401);
  });

  it("rejects invalid profile payload", async () => {
    const { token } = await createAuthUser();

    const response = await request(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        profileData: {
          skills: "React, Node.js",
        },
      });

    expect(response.statusCode).toBe(400);
  });
});