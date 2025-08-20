import React, { useState } from 'react';
import axios from 'axios';

function MeetingList({ meetings, fetchMeetings }) {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [editMeeting, setEditMeeting] = useState(null);
  const [formData, setFormData] = useState({ title: '', date: new Date().toISOString().split('T')[0], status: 'Upcoming' });

  const handleView = (meeting) => setSelectedMeeting(meeting);
  const handleEdit = (meeting) => {
    setEditMeeting(meeting);
    setFormData({ title: meeting.title, date: new Date(meeting.date).toISOString().split('T')[0], status: meeting.status });
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await axios.delete(`http://localhost:5000/api/meetings/${id}`);
      fetchMeetings();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      alert('Title and Date are required');
      return;
    }
    try {
      if (editMeeting && editMeeting._id) {
        await axios.put(`http://localhost:5000/api/meetings/${editMeeting._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/meetings', formData);
      }
      setEditMeeting(null);
      setFormData({ title: '', date: new Date().toISOString().split('T')[0], status: 'Upcoming' });
      fetchMeetings();
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="meeting-list">
      <h3>Buyer Meetings</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((meeting) => (
            <tr key={meeting._id}>
              <td>{meeting.title}</td>
              <td>{new Date(meeting.date).toLocaleDateString()}</td>
              <td>
                <span className={`status-${meeting.status.toLowerCase()}`}>
                  {meeting.status}
                </span>
              </td>
              <td>
                <button onClick={() => handleView(meeting)}>View</button>
                <button onClick={() => handleEdit(meeting)}>Edit</button>
                <button onClick={() => handleDelete(meeting._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(selectedMeeting || editMeeting) && (
        <div className="meeting-details">
          <h4>{editMeeting ? 'Edit Meeting' : 'View Meeting'}</h4>
          {editMeeting ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Title"
                required
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Overdue">Overdue</option>
              </select>
              <button type="submit">Save</button>
              <button onClick={() => setEditMeeting(null)}>Cancel</button>
            </form>
          ) : (
            <div>
              <p><strong>Title:</strong> {selectedMeeting.title}</p>
              <p><strong>Date:</strong> {new Date(selectedMeeting.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedMeeting.status}</p>
              <button onClick={() => setSelectedMeeting(null)}>Close</button>
            </div>
          )}
        </div>
      )}
      {!editMeeting && (
        <button onClick={() => setEditMeeting({})}>Add New Meeting</button>
      )}
    </div>
  );
}

export default MeetingList;