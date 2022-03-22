const express = require('express');
const {
  getAllPost,
  createPost,
  likePost,
  dislikePost,
} = require('../Controller/postController');
const loginMiddleware = require('../Middleware/loginMiddleware');
const postRouter = express.Router();

postRouter.post('/getAllPost', loginMiddleware, getAllPost);
postRouter.post('/createPost', loginMiddleware, createPost);
postRouter.put('/likes', loginMiddleware, likePost);
postRouter.put('/dislikes', loginMiddleware, dislikePost);

module.exports = postRouter;
