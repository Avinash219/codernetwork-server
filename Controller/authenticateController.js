const { StatusCodes } = require('http-status-codes');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');

const User = require('../Model/User');
const {
  sendConfirmationMail,
  generatePasswordLink,
} = require('../Config/nodemailer.config');
const PasswordReset = require('../Model/PasswordReset');
const _ = require('underscore');
const CustomError = require('../Middleware/Error/CustomError');
const clientErrorHandler = require('../Middleware/Error/clientErrorHandler');

module.exports = {
  login: (request, response, next) => {
    const { email, password } = request.body;
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return next(
            new CustomError(
              StatusCodes.BAD_REQUEST,
              'User with email does not exist! Please signup'
            )
          );
        } else if (user.status !== 'Active') {
          return next(
            new CustomError(
              StatusCodes.UNAUTHORIZED,
              'Please confirm your email before login.'
            )
          );
        } else if (!user.validatePassword(password)) {
          return next(
            new CustomError(
              StatusCodes.BAD_REQUEST,
              'Email and password do not match'
            )
          );
        }
        const token = jwt.sign(
          {
            name: user.name,
            id: user._id,
          },
          'AVINASH',
          { expiresIn: 60 * 60 * 24 }
        );
        const { _id, username, name, email, role } = user;
        return response.status(StatusCodes.OK).send({
          token,
          user: { _id, username, name, email, role },
        });
      })
      .catch((error) => {
        next(error);
      });
  },
  signup: async (request, response, next) => {
    let user = await User.findOne({ email: request.body.email }).catch(
      (error) => next(error)
    );
    if (user) {
      return next(
        new CustomError(StatusCodes.BAD_REQUEST, 'Email already taken')
      );
    }
    const { name, email, password } = request.body;
    let username = shortid.generate();
    let profile = `http://localhost:4200/user/${username}`;
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
      data: 'Sign up success! Please signin.',
    });
  },

  verifyUser: async (req, res, next) => {
    let user = User.findOne({
      confirmationCode: req.params.confirmationCode,
    }).catch((error) => next(error));
    if (!user) {
      return next(new CustomError(StatusCodes.UNAUTHORIZED, 'User Not found.'));
    }
    user.status = 'Active';
    await user.save().catch((error) => next(error));
    const token = jwt.sign(
      {
        name: user.name,
        id: user._id,
      },
      'AVINASH',
      { expiresIn: '1d' }
    );
    const { _id, username, name, email, role } = user;
    return res.status(StatusCodes.OK).send({
      token,
      user: { _id, username, name, email, role },
    });
  },

  generatePasswordLink: async (req, res, next) => {
    if (!req.body.email) {
      return next(new CustomError(StatusCodes.BAD_REQUEST, 'User Not found.'));
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new CustomError(StatusCodes.NOT_FOUND, 'User Not found.'));
    }
    let resetToken = new PasswordReset({
      user: user._id,
      resettoken:
        Date.now().toString(36) + Math.random().toString(36).substr(2),
    });
    resetToken.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      PasswordReset.find({
        _userId: user._id,
        resettoken: { $ne: resetToken.resettoken },
      })
        .remove()
        .exec();
      res.status(200).json({ message: 'Reset Password successfully.' });
      generatePasswordLink(user.name, user.email, resetToken.resettoken);
    });
  },

  resetPassword: async (req, res) => {
    let token = req.body.token;
    let user = await User.findOne({ email: req.body.email });
    let userId = user._id;
    console.log('Req', req.body.password);
    console.log('User', userId);
    let passwordResetToken = await PasswordReset.findOne({ userId });

    user = _.extend(user, { password: req.body.password });
    await user.save();

    res.status(200).json({ message: 'Reset Password successfully.' });
    //await PasswordReset.deleteOne();
  },
};
