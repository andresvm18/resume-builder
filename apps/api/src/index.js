// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const resumeRoutes = require("./routes/resume.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Middleware setup
app.use(cors());                 // Enable Cross-Origin Resource Sharing
app.use(express.json());         // Parse JSON request bodies

// Route registration
app.use("/api/auth", authRoutes);    // Authentication endpoints
app.use("/api/resume", resumeRoutes); // Resume-related endpoints

// Start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});