const ActionItem = require('../models/ActionItem');

exports.createActionItem = async (req, res) => {
  try {
    const { title, status, dueDate, assignedTo } = req.body;
    const actionItem = new ActionItem({ title, status, dueDate, assignedTo });
    await actionItem.save();
    res.status(201).json(actionItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getActionItems = async (req, res) => {
  try {
    const actionItems = await ActionItem.find();
    res.json(actionItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActionItemById = async (req, res) => {
  try {
    const actionItem = await ActionItem.findById(req.params.id);
    if (!actionItem) return res.status(404).json({ message: 'Action Item not found' });
    res.json(actionItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateActionItem = async (req, res) => {
  try {
    const { title, status, dueDate, assignedTo } = req.body;
    const actionItem = await ActionItem.findByIdAndUpdate(
      req.params.id,
      { title, status, dueDate, assignedTo },
      { new: true, runValidators: true }
    );
    if (!actionItem) return res.status(404).json({ message: 'Action Item not found' });
    res.json(actionItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteActionItem = async (req, res) => {
  try {
    const actionItem = await ActionItem.findByIdAndDelete(req.params.id);
    if (!actionItem) return res.status(404).json({ message: 'Action Item not found' });
    res.json({ message: 'Action Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};