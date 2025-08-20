const Chat = require('../models/Chat');

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { message, time } = req.body;
    const chat = new Chat({ message, time });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};