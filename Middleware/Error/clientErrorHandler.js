const CustomError = require('./CustomError');
const { StatusCodes } = require('http-status-codes');
const { GLOBAL_ERROR_MESSAGE } = require('../../error-message-constant');

function clientErrorHandler(err, request, response, next) {
  if (!(err instanceof CustomError)) {
    err = new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      GLOBAL_ERROR_MESSAGE
    );
  }
  response.status(err.status).send({
    error: err.message,
  });
}

module.exports = clientErrorHandler;
