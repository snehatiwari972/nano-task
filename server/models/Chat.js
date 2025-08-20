// server/models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  message: { type: String, required: true },
  time: { type: String, required: true },
});

module.exports = mongoose.model('Chat', chatSchema);