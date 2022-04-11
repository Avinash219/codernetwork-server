function logError(err, request, response, next) {
  console.error(err);
  next(err);
}

module.exports = logError;
