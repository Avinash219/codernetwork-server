const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const tipSchema = new mongoose.Schema(
  {
    tip: {
      type: String,
      min: 3,
      max: 2000,
      required: true,
      trim: true,
    },
    tipAddedBy: {
      type: ObjectId,
      ref: 'User',
    },
    likes: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    tipTags: [
      {
        type: ObjectId,
        ref: 'Tag',
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

module.exports = mongoose.model('Tip', tipSchema);
