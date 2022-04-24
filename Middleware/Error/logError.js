function logError(err, request, response, next) {
  next(err);
}

module.exports = logError;
