const { StatusCodes } = require('http-status-codes');
const Post = require('../Model/Post');

module.exports = {
  getAllPost: (request, response) => {
    let searchParam;
    const { limit, currentPage } = request.query;
    request.body.searchParam ? (searchParam = request.body.searchParam) : null;
    Post.find(
      searchParam ? { post: { $regex: searchParam, $options: '$i' } } : {}
    )
      .limit(parseInt(limit))
      .skip(parseInt(currentPage) * parseInt(limit))
      .exec((err, result) => {
        if (err) {
          console.log(err);
        }
        Post.countDocuments(
          searchParam ? { post: { $regex: searchParam, $options: '$i' } } : {}
        ).exec((count_error, count) => {
          if (count_error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
              message: count_error,
            });
          }
          return response.status(StatusCodes.OK).send({
            data: result,
            records: count,
          });
        });
      });
  },

  createPost: (request, response) => {
    const { post, author } = request.body;
    const newPost = new Post({
      post,
      author,
    });
    newPost.save((err, success) => {
      if (err) {
        return response.status(StatusCodes.BAD_REQUEST).send({
          error: err,
        });
      }
      return response.status(StatusCodes.OK).send({
        data: 'Post saved successfully.',
      });
    });
  },

  likePost: (request, response) => {
    Post.findByIdAndUpdate(
      request.body.id,
      {
        $push: { likes: request.body.id },
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      if (err) {
        return response.status(StatusCodes.BAD_REQUEST).send({
          error: err,
        });
      }
      request.app
        .get('io')
        .emit('likeUpdated', { _id: result._id, likes: result.likes });
      return response.status(StatusCodes.OK).send({
        data: result,
      });
    });
  },

  dislikePost: (request, response) => {
    Post.findByIdAndUpdate(
      request.body.id,
      {
        $push: { dislikes: request.body.userId },
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      if (err) {
        return response.status(StatusCodes.BAD_REQUEST).send({
          error: err,
        });
      }
      return response.status(StatusCodes.OK).send({
        data: result,
      });
    });
  },
};
