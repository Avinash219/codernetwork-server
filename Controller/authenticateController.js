const { StatusCodes } = require('http-status-codes');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../Model/User');
const { sendConfirmationMail } = require('../Config/nodemailer.config');

module.exports = {
  login: (request, response, next) => {
    console.log('RequestBody', request.body);
    return passport.authenticate(
      'local',
      { session: false },
      (err, passportUser, info) => {
        if (err) {
          console.log('Inside error', err);
          return next(err);
        }

        if (passportUser) {
          const token = jwt.sign(
            {
              username: passportUser.username,
            },
            'AUTHENTICATE',
            {
              expiresIn: 86400,
            }
          );

          return response.status(StatusCodes.OK).send({
            message: `User Logged in successfully.`,
            token: token,
          });
        }

        console.log('Info', info.message);
        return response.status(StatusCodes.BAD_REQUEST).send(info);
      }
    )(request, response, next);
  },
  register: async (request, response) => {
    const token = jwt.sign(
      {
        email: request.body.email,
      },
      'Authenticate'
    );
    request.body['confirmationCode'] = token;
    const newUser = await User.create(request.body);
    newUser.setPassword(request.body.password);
    await newUser.save();
    response.status(StatusCodes.OK).send({
      message: `Confirmation mail has been sent to ${request.body.email}.
            Please confirm by clicking on link.`,
    });
    /*  sendConfirmationMail(
          request.body.username,
          request.body.email,
          request.body.confirmationCode
        ) */
  },
  verifyUser: (request, response) => {
    User.findOne({
      confirmationCode: request.params.confirmationCode,
    }).then((user) => {
      user.status = 'Active';
      user.save();
      response.status(StatusCodes.OK).send({
        message: 'User activated successfully.',
      });
    });
  },
};
