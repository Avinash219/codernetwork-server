const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    post: {
      type: String,
      min: 3,
      max: 2000,
      required: true,
      trim: true,
    },
    author: {
      type: ObjectId,
      ref: 'User',
    },
    comments: [
      {
        text: String,
        postedBy: {
          type: ObjectId,
          ref: 'User',
        },
      },
    ],
    likes: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
