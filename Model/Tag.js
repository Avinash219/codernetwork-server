const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const tagsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  questionTagged: [{ type: ObjectId, ref: 'Question' }],
  tipTagged: [{ type: ObjectId, ref: 'Tip' }],
});

module.exports = mongoose.model('Tag', tagsSchema);
