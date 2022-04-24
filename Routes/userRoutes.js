const express = require('express');
const multer = require('multer');
const path = require('path');

const {
  updateProfile,
  photo,
  getUserDetail,
} = require('../Controller/userController');
const userRouter = express.Router();

let storage = multer.diskStorage({
  destination: './public',
  filename: (request, file, cb) => {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({
  storage: storage,
}).single('imageDetails');

userRouter.post('/user/update', upload, updateProfile);
userRouter.get('/user/photo/:username', photo);
userRouter.get('/user/:username', getUserDetail);

module.exports = userRouter;
