// Import Prisma Client for database operations
const { PrismaClient } = require("@prisma/client");

// Import Prisma's PostgreSQL adapter for improved performance
const { PrismaPg } = require("@prisma/adapter-pg");

// Import PostgreSQL connection pool from 'pg' library
const { Pool } = require("pg");

// Get database connection string from environment variables
const connectionString = process.env.DATABASE_URL;

// Validate that DATABASE_URL is configured
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

// Create a PostgreSQL connection pool
// The pool manages multiple database connections efficiently
const pool = new Pool({ connectionString });

// Create Prisma adapter using the connection pool
// Adapter pattern allows Prisma to work with external connection management
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with the custom adapter
// This gives us better control over connection lifecycle
const prisma = new PrismaClient({ adapter });

// Export configured Prisma instance for use throughout the app
module.exports = prisma;