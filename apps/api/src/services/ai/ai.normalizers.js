function normalizeTechnicalSkills(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((group) => group && typeof group === "object")
    .map((group) => ({
      category: String(group.category || "").trim(),
      items: Array.isArray(group.items)
        ? group.items.map((item) => String(item).trim()).filter(Boolean)
        : [],
    }))
    .filter((group) => group.category && group.items.length);
}

function normalizeSoftSkills(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((skill) => skill && typeof skill === "object")
    .map((skill) => ({
      name: String(skill.name || "").trim(),
      description: String(skill.description || "").trim(),
    }))
    .filter((skill) => skill.name && skill.description);
}

function fallbackOptimizedResume(resumeData, jobDescription) {
  return {
    ...resumeData,
    fullName: resumeData.fullName,
    email: resumeData.email,
    phone: resumeData.phone,
    location: resumeData.location,
    skills: resumeData.skills || [],
    technicalSkills: [],
    softSkills: [],
    jobDescription,
  };
}

module.exports = {
  normalizeTechnicalSkills,
  normalizeSoftSkills,
  fallbackOptimizedResume,
};