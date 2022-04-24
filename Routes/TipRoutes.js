const express = require('express');
const { addTip, getTipList } = require('../Controller/tipsController');
const loginMiddleware = require('../Middleware/loginMiddleware');

const tipRouter = express.Router();

tipRouter.post('/addTip', loginMiddleware, addTip);
tipRouter.get('/getTip', getTipList);

module.exports = tipRouter;
