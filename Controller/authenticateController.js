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

module.exports = {
  login: (request, response) => {
    const { email, password } = request.body;
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return response.status(StatusCodes.BAD_REQUEST).send({
            error: 'User with email does not exist! Please signup',
          });
        }
        if (user.status !== 'Active') {
          return response.status(StatusCodes.UNAUTHORIZED).send({
            error: 'Please validate your email before login.',
          });
        }
        if (!user.validatePassword(password)) {
          return response.status(StatusCodes.BAD_REQUEST).send({
            error: 'Email and password do not match',
          });
        }
        const token = jwt.sign(
          {
            name: user.name,
            id: user._id,
          },
          'AVINASH',
          { expiresIn: 60 * 60 }
        );
        const { _id, username, name, email, role } = user;
        return response.status(StatusCodes.OK).send({
          token,
          user: { _id, username, name, email, role },
        });
      })
      .catch((error) => {
        return response.status(StatusCodes.BAD_REQUEST).send({
          error: error,
        });
      });
  },
  signup: async (request, response) => {
    User.findOne({ email: request.body.email })
      .then((user) => {
        if (user) {
          return response.status(StatusCodes.BAD_REQUEST).send({
            error: 'Email already taken',
          });
        }
        const { name, email, password } = request.body;
        let username = shortid.generate();
        let profile = `http://localhost:4200/user/${username}`;
        let confirmationCode =
          Date.now().toString(36) + Math.random().toString(36).substr(2);
        console.log('Confirm', confirmationCode);
        const newUser = new User({
          name,
          email,
          password,
          profile,
          username,
          confirmationCode,
        });
        newUser.save((err, success) => {
          if (err) {
            return response.status(StatusCodes.OK).send({
              error: err,
            });
          }
          console.log('New user', newUser);
          sendConfirmationMail(
            newUser.name,
            newUser.email,
            newUser.confirmationCode
          );
          return response.status(StatusCodes.OK).send({
            data: 'Sign up success! Please signin.',
          });
        });
      })
      .catch((error) => {
        return response.status(StatusCodes.BAD_REQUEST).send({
          error: error,
        });
      });
  },

  validateTokenController: (req, res) => {
    console.log(req.body);
    const isTokenValid = jwt.verify(req.body.token, 'AVINASH');
    console.log(isTokenValid);
  },

  verifyUser: (req, res) => {
    console.log(req.params.confirmationCode);
    User.findOne({
      confirmationCode: req.params.confirmationCode,
    })
      .then((user) => {
        console.log(user);
        if (!user) {
          return res.status(401).send({ message: 'User Not found.' });
        }
        user.status = 'Active';
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
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
        });
      })
      .catch((e) => console.log('error', e));
  },

  generatePasswordLink: async (req, res) => {
    if (!req.body.email) {
      return res.status(400).send({ message: 'Email is required' });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ message: 'Email is not found' });
    }
    console.log('User', user);
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
