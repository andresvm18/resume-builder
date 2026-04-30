const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_later";

/**
 * Express middleware to authenticate JWT tokens
 * Extracts token from Authorization header and verifies it
 * On success: attaches decoded user data to req.user
 * On failure: returns 401 Unauthorized
 */
function authMiddleware(req, res, next) {
  // Get Authorization header (format: "Bearer <token>")
  const authHeader = req.headers.authorization;

  // Check if header exists and has correct format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // Extract token (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach user data to request object for downstream handlers
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = authMiddleware;