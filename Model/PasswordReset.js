const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resettoken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

passwordResetSchema.index(
  {
    updatedAt: 1,
  },
  {
    expiresAfterSeconds: 300,
  }
);

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
