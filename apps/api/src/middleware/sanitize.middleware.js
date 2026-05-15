const sanitizeHtml = require("sanitize-html");

function sanitizeValue(value) {
  if (typeof value === "string") {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        sanitizeValue(val),
      ])
    );
  }

  return value;
}

function sanitizeRequest(req, _res, next) {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  next();
}

module.exports = {
  sanitizeRequest,
};