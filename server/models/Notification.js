// server/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  time: { type: String, required: true },
});

module.exports = mongoose.model('Notification', notificationSchema);