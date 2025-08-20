const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  message: { type: String, required: true },
  time: { type: Date, default: Date.now },
  sender: { type: String, required: true }
});

module.exports = mongoose.model('Chat', chatSchema);