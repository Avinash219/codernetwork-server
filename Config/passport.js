const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../Model/User');

const { USER_STATUS } = require('../global-constant');
const { ERROR_MESSAGE } = require('./config-constant');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    (email, password, done) => {
      User.findOne({ username: email })
        .then((user) => {
          if (user.status === USER_STATUS.PENDING) {
            return done(null, false, {
              message: ERROR_MESSAGE.ACTIVATION_MESSAGE,
            });
          }

          if (!user || !user.validatePassword(password)) {
            return done(null, false, {
              message: ERROR_MESSAGE.INVALID_LOGIN,
            });
          }
          return done(null, user);
        })
        .catch(done);
    }
  )
);
