const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const User = require('../Model/User');

module.exports = (req, response, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return response.status(StatusCodes.BAD_REQUEST).send({
      error: 'User is not authorized',
    });
  }
  const token = authorization.replace('Bearer', '');
  jwt.verify(token, 'AVINASH', (err, payload) => {
    if (err) {
      return response.status(StatusCodes.BAD_REQUEST).send({
        error: err,
      });
    }
    const { id } = payload;
    User.findById({ _id: id })
      .then((userdata) => {
        req.user = userdata;
        next();
      })
      .catch((error) => {
        return response.status(StatusCodes.BAD_REQUEST).send({
          error: error,
        });
      });
  });
};
