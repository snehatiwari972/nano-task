const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  dateTime: { type: Date, required: true },
  status: { type: String, enum: ['Completed', 'Upcoming', 'Overdue', 'Draft', 'Archive'], required: true },
  type: { type: String, enum: ['Online', 'Offline'] }, 
  buyerName: { type: String },
  brand: { type: String },
  dept: { type: String },
  title: { type: String, required: true },
  meetingDate: { type: Date, required: true },
});

module.exports = mongoose.model('Meeting', meetingSchema);