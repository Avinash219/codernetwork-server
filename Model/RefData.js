const mongoose = require('mongoose');

const refDataSchema = new mongoose.Schema({
  refDataType: String,
  refDataValue: [String],
});

module.exports = mongoose.model('refData', refDataSchema);
