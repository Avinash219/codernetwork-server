const express = require('express');
const {
  getAllPost,
  createPost,
  likePost,
  dislikePost,
  addComment,
  getComment,
} = require('../Controller/postController');
const loginMiddleware = require('../Middleware/loginMiddleware');
const postRouter = express.Router();

postRouter.post('/getAllPost', getAllPost);
postRouter.post('/createPost', loginMiddleware, createPost);
postRouter.put('/likes', loginMiddleware, likePost);
postRouter.put('/dislikes', loginMiddleware, dislikePost);
postRouter.put('/addComment', loginMiddleware, addComment);
postRouter.get('/getComment/:id', loginMiddleware, getComment);

module.exports = postRouter;
