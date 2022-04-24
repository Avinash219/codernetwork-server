const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const refDataSchema = new mongoose.Schema({
  refDataType: String,
  refDataValue: [String],
});

module.exports = mongoose.model('refData', refDataSchema);
