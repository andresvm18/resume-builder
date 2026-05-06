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

const experienceSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string().optional().default(""),
  location: z.string().optional().default(""),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

const educationSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  institution: z.string().optional().default(""),
  degree: z.string().optional().default(""),
  date: z.string().optional().default(""),
});

const languageSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().optional().default(""),
  level: z.string().optional().default("Advanced"),
});

const projectSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().optional().default(""),
  technologies: z.string().optional().default(""),
  description: z.string().optional().default(""),
  link: z.string().optional().default(""),
});

const technicalSkillGroupSchema = z.object({
  category: z.string().optional().default(""),
  items: z.array(z.string()).optional().default([]),
});

const softSkillSchema = z.object({
  name: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

const resumeDataObjectSchema = z.object({
  fullName: z.string().optional().default(""),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  location: z.string().optional().default(""),
  summary: z.string().optional().default(""),

  skills: z.array(z.string()).optional().default([]),
  technicalSkills: z.array(technicalSkillGroupSchema).optional().default([]),
  softSkills: z.array(softSkillSchema).optional().default([]),

  languages: z.array(languageSchema).optional().default([]),
  experiences: z.array(experienceSchema).optional().default([]),
  education: z.array(educationSchema).optional().default([]),
  projects: z.array(projectSchema).optional().default([]),

  jobDescription: z.string().optional().default(""),
}).passthrough();

const generateResumeSchema = resumeDataObjectSchema.extend({
  fullName: z.string().trim().min(1),
  email: z.string().trim().email(),
  summary: z.string().trim().min(1),
});

const resumeDataSchema = z.object({
  resumeData: resumeDataObjectSchema,
  jobDescription: z.string().optional().default(""),
});

const aiWithJobDescriptionSchema = z.object({
  resumeData: resumeDataObjectSchema,
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