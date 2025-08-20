const Meeting = require('../models/Meeting');

exports.createMeeting = async (req, res) => {
  try {
    // Use all fields from req.body
    const {
      title,
      dateTime,
      meetingDate,
      status,
      type,
      buyerName,
      brand,
      dept
    } = req.body;
    const meeting = new Meeting({
      title,
      dateTime,
      meetingDate,
      status,
      type,
      buyerName,
      brand,
      dept
    });
    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Meeting.countDocuments();
    const meetings = await Meeting.find().skip(skip).limit(limit);

    res.json({
      meetings,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
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
    // Use all fields from req.body
    const {
      title,
      dateTime,
      meetingDate,
      status,
      type,
      buyerName,
      brand,
      dept
    } = req.body;
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      {
        title,
        dateTime,
        meetingDate,
        status,
        type,
        buyerName,
        brand,
        dept
      },
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