function getLanguageInstructions(language = "es") {
  if (language === "en") {
    return `
- Write entirely in English.
- Use fluent, natural, professional English.
- Do not mix Spanish and English.
- Keep ATS-friendly wording.
`;
  }

  return `
- Escribe completamente en español.
- Usa español natural, profesional y fluido.
- No mezcles español e inglés.
`;
}

module.exports = {
  getLanguageInstructions,
};