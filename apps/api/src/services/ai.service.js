function optimizeSummary({ resumeData, jobDescription }) {
  const currentSummary = resumeData?.summary || "";

  return {
    optimizedSummary:
      currentSummary.trim().length > 0
        ? `${currentSummary} Perfil orientado a la vacante, destacando habilidades y experiencia relevantes según la oferta laboral.`
        : "Profesional orientado a resultados, con habilidades alineadas a la oferta laboral y capacidad para aportar valor en el puesto objetivo.",
    source: "mock",
    jobContextUsed: Boolean(jobDescription?.trim()),
  };
}

module.exports = {
  optimizeSummary,
};