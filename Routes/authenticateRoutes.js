const express = require('express');
const {
  register,
  login,
  verifyUser,
  signup,
  validateTokenController,
  generatePasswordLink,
  resetPassword,
} = require('../Controller/authenticateController');

const authenticateRouter = express.Router();

authenticateRouter.post('/signup', signup);
authenticateRouter.get('/confirmRegister/:confirmationCode', verifyUser);
authenticateRouter.post('/generatePasswordResetLink', generatePasswordLink);
authenticateRouter.post('/resetPassword', resetPassword);
authenticateRouter.post('/login', login);

module.exports = authenticateRouter;
