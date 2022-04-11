const express = require('express');
const {
  getRefData,
  addRefData,
  addRefDataType,
  addRefDataValue,
} = require('../Controller/RefDataController');

const refDataRouter = express.Router();

refDataRouter.post('/addRefDataType', addRefDataType);
refDataRouter.get('/getRefData', getRefData);
refDataRouter.put('/addRefDataValue/:refDataType', addRefDataValue);

module.exports = refDataRouter;
