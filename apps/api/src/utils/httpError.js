function createHttpError(statusCode, message, options = {}) {
  const error = new Error(message);
  error.statusCode = statusCode;

  if (options.cause) {
    error.cause = options.cause;
  }

  return error;
}

module.exports = createHttpError;