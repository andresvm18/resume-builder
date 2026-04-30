const {
  registerUser,
  loginUser,
  getUserById,
} = require("../services/auth.service");

/**
 * Handle user registration request
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const result = await registerUser({ name, email, password });

    return res.status(201).json(result);
  } catch (error) {
    // Handle duplicate email error
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Generic server error
    return res.status(500).json({
      message: "Error registering user",
    });
  }
}

/**
 * Handle user login request
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await loginUser({ email, password });

    return res.json(result);
  } catch (error) {
    // Handle invalid credentials
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    return res.status(500).json({
      message: "Error logging in",
    });
  }
}

/**
 * Get current authenticated user's profile
 * GET /api/auth/me (protected route)
 */
async function me(req, res) {
  try {
    // req.user is populated by authMiddleware
    const user = await getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({ user });
  } catch {
    return res.status(500).json({
      message: "Error fetching user",
    });
  }
}

module.exports = {
  register,
  login,
  me,
};