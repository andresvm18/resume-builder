const { prisma } = require("../../lib/prisma");
const env = require("../../config/env");

async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: "healthy",
    };
  } catch {
    return {
      status: "unhealthy",
    };
  }
}

function checkAiProviders() {
  return {
    openrouter: !!process.env.OPENROUTER_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
  };
}

function checkMemoryUsage() {
  const memoryUsage = process.memoryUsage();

  const heapUsedMb = Math.round(
    memoryUsage.heapUsed / 1024 / 1024
  );

  return {
    rss: memoryUsage.rss,
    heapTotal: memoryUsage.heapTotal,
    heapUsed: memoryUsage.heapUsed,
    heapUsedMb,

    status:
      heapUsedMb > 700
        ? "warning"
        : "healthy",
  };
}

async function getSystemHealth() {
  const database = await checkDatabase();

  const aiProviders = checkAiProviders();

  const memory = checkMemoryUsage();

  const overallStatus =
    database.status === "healthy"
      ? "healthy"
      : "degraded";

  return {
    status: overallStatus,

    environment: env.NODE_ENV,

    uptime: process.uptime(),

    timestamp: new Date().toISOString(),

    database,

    aiProviders,

    memory,
  };
}

module.exports = {
  getSystemHealth,
};