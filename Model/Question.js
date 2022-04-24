const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      min: 3,
      max: 2000,
      required: true,
      trim: true,
    },
    askedBy: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    answer: [
      {
        type: ObjectId,
        ref: 'Answer',
      },
    ],
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
    questionTags: [
      {
        type: ObjectId,
        ref: 'Tag',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
