const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../Model/User');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    (email, password, done) => {
      User.findOne({ username: email })
        .then((user) => {
          console.log('User', user);
          if (user.status === 'Pending') {
            console.log('Inside activation password');
            return done(null, false, {
              message: 'Activate user before proceeding',
            });
          }

          if (!user || !user.validatePassword(password)) {
            console.log('Inside invalidate password');
            return done(null, false, {
              message: 'Username or password is invalid',
            });
          }
          console.log('Outside');
          return done(null, user);
        })
        .catch(done);
    }
  )
);
