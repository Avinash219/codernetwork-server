const { USER_AUTHENTICATE } = require('../error-message-constant');

const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const User = require('../Model/User');

module.exports = (request, response, next) => {
  const { authorization } = request.headers;
  if (!authorization) {
    return response.status(StatusCodes.BAD_REQUEST).send({
      error: USER_AUTHENTICATE.UNAUTHORIZED_USER,
    });
  }
  const token = authorization.replace('Bearer', '');
  jwt.verify(token, process.env.AUTHENTICATION_JWT_SECRET, (err, payload) => {
    if (err) {
      return response.status(StatusCodes.BAD_REQUEST).send({
        error: err,
      });
    }
    const { id } = payload;
    User.findById({ _id: id })
      .then((userdata) => {
        request.user = userdata;
        next();
      })
      .catch((error) => {
        return response.status(StatusCodes.BAD_REQUEST).send({
          error: error,
        });
      });
  });
};
