function cleanJsonText(text = "") {
  let cleaned = String(text)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

function parseAiJson(text) {
  return JSON.parse(cleanJsonText(text));
}

module.exports = {
  cleanJsonText,
  parseAiJson,
};