const mongoose = require('mongoose');
const crypto = require('crypto');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      max: 32,
      unique: true,
      index: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    profile: {
      type: String,
      required: true,
    },
    salt: String,
    hashed_password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Active'],
      default: 'Pending',
    },
    confirmationCode: {
      type: String,
      required: true,
    },
    about: {
      type: String,
    },
    role: {
      type: String,
      trim: true,
    },
    imageDetails: String,
    resetPasswordLink: {
      data: String,
      default: '',
    },
    mediumUrl: {
      type: String,
    },
    linkedinUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    technologyStack: [
      {
        type: ObjectId,
        ref: 'TechStack',
      },
    ],
    experience: {
      type: Number,
    },
  },
  { timestamps: true }
);

userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    console.log('Password', this._password);
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  encryptPassword: function (password) {
    if (!password) return;
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return err;
    }
  },
  makeSalt: function () {
    return crypto.randomBytes(16).toString('hex');
  },
  validatePassword: function (password) {
    return this.encryptPassword(password) === this.hashed_password;
  },
};

module.exports = mongoose.model('User', userSchema);
