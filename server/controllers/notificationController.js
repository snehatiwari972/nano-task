const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { message, time } = req.body;
    const notification = new Notification({ message, time });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};