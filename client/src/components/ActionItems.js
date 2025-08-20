import React, { useState } from 'react';
import axios from 'axios';

function ActionItems({ actionItems, fetchActionItems }) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [editAction, setEditAction] = useState(null);
  const [formData, setFormData] = useState({ title: '', status: 'In Progress', dueDate: new Date().toISOString().split('T')[0], assignedTo: '' });
  const [actionMenu, setActionMenu] = useState(null);

  const handleView = (action) => setSelectedAction(action);
  const handleEdit = (action) => {
    setEditAction(action);
    setFormData({ title: action.title, status: action.status, dueDate: new Date(action.dueDate).toISOString().split('T')[0], assignedTo: action.assignedTo });
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await axios.delete(`http://localhost:5000/api/action-items/${id}`);
      fetchActionItems();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate || !formData.assignedTo) {
      alert('Title, Due Date, and Assigned To are required');
      return;
    }
    try {
      if (editAction && editAction._id) {
        await axios.put(`http://localhost:5000/api/action-items/${editAction._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/action-items', formData);
      }
      setEditAction(null);
      setFormData({ title: '', status: 'In Progress', dueDate: new Date().toISOString().split('T')[0], assignedTo: '' });
      fetchActionItems();
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="action-items">
      <h3>Action Items ({actionItems.length})</h3>
      <table>
        <thead>
          <tr>
            <th>Action Item</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Assigned To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {actionItems.map((action) => (
            <tr key={action._id}>
              <td>{action.title}</td>
              <td>{action.status}</td>
              <td>{new Date(action.dueDate).toLocaleDateString()}</td>
              <td>{action.assignedTo}</td>
              <td>
                <button
                  className="action-dot"
                  onClick={(e) => {
                    e.preventDefault();
                    setActionMenu(actionMenu === action._id ? null : action._id);
                  }}
                >
                  ⋮
                </button>
                {actionMenu === action._id && (
                  <div className="action-menu">
                    <button onClick={() => { handleView(action); setActionMenu(null); }}>View</button>
                    <button onClick={() => { handleEdit(action); setActionMenu(null); }}>Edit</button>
                    <button onClick={() => { handleDelete(action._id); setActionMenu(null); }}>Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(selectedAction || editAction) && (
        <div className="meeting-details">
          <h4>{editAction ? 'Edit Action Item' : 'View Action Item'}</h4>
          {editAction ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Action Item"
                required
              />
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                placeholder="Assigned To"
                required
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
              <button type="submit">Save</button>
              <button onClick={() => setEditAction(null)}>Cancel</button>
            </form>
          ) : (
            <div>
              <p><strong>Action Item:</strong> {selectedAction.title}</p>
              <p><strong>Due Date:</strong> {new Date(selectedAction.dueDate).toLocaleDateString()}</p>
              <p><strong>Assigned To:</strong> {selectedAction.assignedTo}</p>
              <p><strong>Status:</strong> {selectedAction.status}</p>
              <button onClick={() => setSelectedAction(null)}>Close</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ActionItems;