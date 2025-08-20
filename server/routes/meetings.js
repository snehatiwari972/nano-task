const express = require('express');
const router = express.Router();
const {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} = require('../controllers/meetingController');

router.post('/meetings', createMeeting);
router.get('/meetings', getMeetings);
router.get('/meetings/:id', getMeetingById);
router.put('/meetings/:id', updateMeeting);
router.delete('/meetings/:id', deleteMeeting);

module.exports = router;