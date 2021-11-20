const express = require('express');
const {
  register,
  login,
  verifyUser,
} = require('../Controller/authenticateController');

const authenticateRouter = express.Router();

authenticateRouter.post('/register', register);
authenticateRouter.get('/confirmRegister/:confirmationCode', verifyUser);
authenticateRouter.post('/login', login);

module.exports = authenticateRouter;
