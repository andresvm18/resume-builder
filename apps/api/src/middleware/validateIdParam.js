function validateIdParam(req, res, next) {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  const isValidCuidLike = /^[a-z0-9_-]{10,}$/i.test(id);

  if (!isValidCuidLike) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  return next();
}

module.exports = validateIdParam;