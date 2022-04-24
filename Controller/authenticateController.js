const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const _ = require('underscore');

const User = require('../Model/User');
const {
  sendConfirmationMail,
  generatePasswordLink,
} = require('../Config/nodemailer.config');
const PasswordReset = require('../Model/PasswordReset');
const CustomError = require('../Middleware/Error/CustomError');
const { USER_AUTHENTICATE } = require('../error-message-constant');
const { USER_STATUS, SUCCESS_MESSAGE } = require('../global-constant');

module.exports = {
  login: async (request, response, next) => {
    const { userEmail, password } = request.body;
    let userDetail = await User.findOne({ userEmail }).catch((error) =>
      next(error)
    );

    if (!userDetail) {
      return next(
        new CustomError(
          StatusCodes.BAD_REQUEST,
          USER_AUTHENTICATE.INVALID_EMAIL
        )
      );
    } else if (user.status !== USER_STATUS.ACTIVE) {
      return next(
        new CustomError(
          StatusCodes.UNAUTHORIZED,
          USER_AUTHENTICATE.CONFIRMATION_PENDING
        )
      );
    } else if (!user.validatePassword(password)) {
      return next(
        new CustomError(
          StatusCodes.BAD_REQUEST,
          USER_AUTHENTICATE.USER_PASSWORD_MISMATCH
        )
      );
    }
    const token = jwt.sign(
      {
        name: user.name,
        id: user._id,
      },
      process.env.AUTHENTICATION_JWT_SECRET,
      { expiresIn: process.env.EXPIRATION_TIME }
    );
    const { _id, username, name, email, role } = user;
    return response.status(StatusCodes.OK).send({
      token,
      user: { _id, username, name, email, role },
    });
  },

  signup: async (request, response, next) => {
    let user = await User.findOne({ email: request.body.email }).catch(
      (error) => next(error)
    );
    if (user) {
      return next(
        new CustomError(
          StatusCodes.BAD_REQUEST,
          USER_AUTHENTICATE.DUPLICATE_EMAIL
        )
      );
    }
    const { name, email, password } = request.body;
    let username = shortid.generate();
    let profile = `${process.env.PROFILE_URL}${username}`;
    let confirmationCode =
      Date.now().toString(36) + Math.random().toString(36).substr(2);
    const newUser = new User({
      name,
      email,
      password,
      profile,
      username,
      confirmationCode,
    });
    await newUser.save().catch((error) => next(error));
    sendConfirmationMail(newUser.name, newUser.email, newUser.confirmationCode);
    return response.status(StatusCodes.OK).send({
      data: SUCCESS_MESSAGE.SIGNIN_SUCCESS,
    });
  },

  verifyUser: async (request, response, next) => {
    let user = await User.findOne({
      confirmationCode: request.params.confirmationCode,
    }).catch((error) => next(error));

    if (!user) {
      return next(
        new CustomError(
          StatusCodes.UNAUTHORIZED,
          USER_AUTHENTICATE.USER_NOT_FOUND
        )
      );
    }
    user.status = USER_STATUS.ACTIVE;
    await user.save().catch((error) => next(error));
    const token = jwt.sign(
      {
        name: user.name,
        id: user._id,
      },
      process.env.AUTHENTICATION_JWT_SECRET,
      { expiresIn: process.env.EXPIRATION_TIME }
    );
    const { _id, username, name, email, role } = user;
    return response.status(StatusCodes.OK).send({
      token,
      user: { _id, username, name, email, role },
    });
  },

  generatePasswordLink: async (request, response, next) => {
    if (!request.body.email) {
      return next(
        new CustomError(
          StatusCodes.BAD_REQUEST,
          USER_AUTHENTICATE.USER_NOT_FOUND
        )
      );
    }
    const user = await User.findOne({ email: request.body.email });
    if (!user) {
      return next(
        new CustomError(StatusCodes.NOT_FOUND, USER_AUTHENTICATE.USER_NOT_FOUND)
      );
    }
    let resetToken = new PasswordReset({
      user: user._id,
      resettoken:
        Date.now().toString(36) + Math.random().toString(36).substr(2),
    });
    await resetToken.save().catch((error) => next(error));
    await PasswordReset.find({
      _userId: user._id,
      resettoken: { $ne: resetToken.resettoken },
    })
      .remove()
      .exec()
      .catch((error) => next(error));

    response
      .status(200)
      .json({ message: SUCCESS_MESSAGE.RESET_PASSWORD_SUCCESS });
    generatePasswordLink(user.name, user.email, resetToken.resettoken);
  },

  resetPassword: async (request, response) => {
    let user = await User.findOne({ email: request.body.email });
    let userId = user._id;
    let passwordResetToken = await PasswordReset.findOne({ userId });

    user = _.extend(user, { password: request.body.password });
    await user.save();

    response
      .status(200)
      .json({ message: SUCCESS_MESSAGE.RESET_PASSWORD_SUCCESS });
    //await PasswordReset.deleteOne();
  },
};
