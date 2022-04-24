const loggerMiddleware = (request, response, next) => {
  console.log(
    `Request is ${request.url} - ${
      request.method
    } - ${new Date().toISOString()}`
  );
  next();
};

module.exports = { loggerMiddleware };
