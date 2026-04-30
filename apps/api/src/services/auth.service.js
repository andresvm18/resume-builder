const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

// JWT secret key - use environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_later";

/**
 * Register a new user
 * @param {Object} params - User registration data
 * @param {string} params.name - User's full name
 * @param {string} params.email - User's email address
 * @param {string} params.password - Plain text password
 * @returns {Promise<Object>} Object containing JWT token and user data
 * @throws {Error} Throws "EMAIL_ALREADY_EXISTS" if email is taken
 */
async function registerUser({ name, email, password }) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  // Hash password with salt rounds = 10
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Generate JWT token (valid for 7 days)
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Return token and user data (excluding password)
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

/**
 * Authenticate user and generate token
 * @param {Object} params - Login credentials
 * @param {string} params.email - User's email
 * @param {string} params.password - Plain text password
 * @returns {Promise<Object>} Object containing JWT token and user data
 * @throws {Error} Throws "INVALID_CREDENTIALS" if authentication fails
 */
async function loginUser({ email, password }) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // Compare provided password with stored hash
  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // Generate new JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

/**
 * Get user by ID (excluding sensitive data)
 * @param {number|string} userId - User's unique identifier
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};