const express = require("express");
const cors = require("cors");
const resumeController = require("./controllers/resume.controller");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/resume", resumeController);

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});