const mongoose = require('mongoose');

const actionItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['In Progress', 'Completed', 'Overdue'], required: true },
  dueDate: { type: Date, required: true },
  assignedTo: { type: String, required: true },
});

module.exports = mongoose.model('ActionItem', actionItemSchema);