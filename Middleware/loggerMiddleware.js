const loggerMiddleware = (req, res, next) => {
  console.log(
    `Request is ${req.url} - ${req.method} - ${new Date().toISOString()}`
  );
  next();
};

module.exports = { loggerMiddleware };
