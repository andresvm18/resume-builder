const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const generateResumeSchema = z.object({
  fullName: z.string().trim().min(1),
  email: z.string().trim().email(),
  summary: z.string().trim().min(1),
});

const resumeDataSchema = z.object({
  resumeData: z.any(),
  jobDescription: z.string().optional(),
});

const aiWithJobDescriptionSchema = z.object({
  resumeData: z.any(),
  jobDescription: z.string().trim().min(1),
});

function validateBody(schema, message = "Datos inválidos") {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message,
        errors: result.error.flatten().fieldErrors,
      });
    }

    req.body = result.data;
    return next();
  };
}

module.exports = {
  registerSchema,
  loginSchema,
  generateResumeSchema,
  resumeDataSchema,
  aiWithJobDescriptionSchema,
  validateBody,
};