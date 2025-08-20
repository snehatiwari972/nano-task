const express = require('express');
const router = express.Router();
const { getChats, createChat } = require('../controllers/chatController');

router.get('/chats', getChats);
router.post('/chats', createChat);

module.exports = router;