const CustomError = require('./CustomError');
const { StatusCodes } = require('http-status-codes');

function clientErrorHandler(err, request, response, next) {
  if (!(err instanceof CustomError)) {
    err = new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Oh !!! Something went wrong.Fixing it soon'
    );
  }
  response.status(err.status).send({
    error: err.message,
  });
}

module.exports = clientErrorHandler;
