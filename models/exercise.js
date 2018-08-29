const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  description: String,
  duration: {type: Number, min: 1, required: true},
  date: {type: Date, default: Date.now},
  userId: {type: Schema.Types.ObjectId, ref: 'User'}

});

module.exports = mongoose.model('Exercise', exerciseSchema);
