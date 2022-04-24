const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const answerSchema = new mongoose.Schema(
  {
    answer: {
      type: String,
      min: 3,
      max: 2000,
      required: true,
      trim: true,
    },
    answeredBy: {
      type: ObjectId,
      required: true,
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

module.exports = mongoose.model('Answer', answerSchema);
