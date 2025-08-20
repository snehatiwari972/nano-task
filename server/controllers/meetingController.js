const Meeting = require('../models/Meeting');

exports.createMeeting = async (req, res) => {
  try {
    const { title, date, status } = req.body;
    const meeting = new Meeting({ title, date, status });
    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    const { title, date, status } = req.body;
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { title, date, status },
      { new: true, runValidators: true }
    );
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json(meeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json({ message: 'Meeting deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};