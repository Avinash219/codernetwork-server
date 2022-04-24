const express = require('express');
const { addTag, getAllTags } = require('../Controller/tagController');

const refDataRouter = express.Router();

refDataRouter.post('/addTag', addTag);
refDataRouter.get('/getTagList', getAllTags);

module.exports = refDataRouter;
