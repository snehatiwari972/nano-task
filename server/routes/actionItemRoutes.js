const express = require('express');
const router = express.Router();
const {
  createActionItem,
  getActionItems,
  getActionItemById,
  updateActionItem,
  deleteActionItem,
} = require('../controllers/actionItemController');

router.post('/action-items', createActionItem);
router.get('/action-items', getActionItems);
router.get('/action-items/:id', getActionItemById);
router.put('/action-items/:id', updateActionItem);
router.delete('/action-items/:id', deleteActionItem);

module.exports = router;