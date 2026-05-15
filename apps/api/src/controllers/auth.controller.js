const {
  registerUser,
  loginUser,
  getUserById,
} = require("../services/auth.service");

const asyncHandler = require("../utils/asyncHandler");
const createHttpError = require("../utils/httpError");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw createHttpError(400, "Name, email and password are required");
  }

  try {
    const result = await registerUser({ name, email, password });
    return res.status(201).json(result);
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      throw createHttpError(409, "Email already exists");
    }

    throw createHttpError(500, "Error registering user");
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createHttpError(400, "Email and password are required");
  }

  try {
    const result = await loginUser({ email, password });
    return res.json(result);
  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") {
      throw createHttpError(401, "Invalid email or password");
    }

    throw createHttpError(500, "Error logging in");
  }
});

const me = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.userId);

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return res.json({ user });
});

module.exports = {
  register,
  login,
  me,
};