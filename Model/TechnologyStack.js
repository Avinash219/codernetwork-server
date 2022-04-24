const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const technologySchema = new mongoose.Schema({
  name: { type: String, required: true },
  profileLinked: [{ type: ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Technology', technologySchema);
