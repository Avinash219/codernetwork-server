const { StatusCodes } = require('http-status-codes');
const User = require('../Model/User');
const _ = require('lodash');
const fs = require('fs');

module.exports = {
  updateProfile: async (request, response) => {
    let imagePath = null;
    if (request.file && request.file.filename) {
      imagePath = 'http://localhost:3000/public/' + request.file.filename;
    }

    let userObj = {
      username: request.body.username,
      imageDetails: imagePath,
      about: request.body.about,
      mediumUrl: request.body.mediumUrl,
      linkedinUrl: request.body.linkedinUrl,
      githubUrl: request.body.githubUrl,
      experience: request.body.experience,
    };
    let username = userObj.username;
    const userDetail = await User.findOneAndUpdate(
      { username },
      { $set: userObj }
    );
    // await userDetail.save();
    response.status(StatusCodes.OK).send({
      message: `Details saved successfully.`,
      user: userDetail,
    });
  },
  photo: (request, response) => {
    const username = request.params.username;
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          return response.status(StatusCodes.BAD_REQUEST).send({
            error: 'Username not found',
          });
        }
        if (user.photo.data) {
          response.set('Content-Type', user.photo.contentType);
          return response.status(StatusCodes.BAD_REQUEST).send({
            error: user.photo.data,
          });
        }
      })
      .catch((error) => {
        return response.status(StatusCodes.BAD_REQUEST).send({
          error: error,
        });
      });
  },
  getUserDetail: (request, response) => {
    let { username } = request.params;
    User.findOne({ username })
      .then((user) => {
        return response.status(StatusCodes.OK).send({
          user: user,
        });
      })
      .catch((error) => {
        return response.status(StatusCodes.BAD_REQUEST).send({
          error: error,
        });
      });
  },
};
