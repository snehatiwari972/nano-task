import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MeetingList({ searchTerm, setSearchTerm }) {
  const [meetings, setMeetings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [editMeeting, setEditMeeting] = useState(null);
  const [createMeeting, setCreateMeeting] = useState(false);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch meetings with pagination, filter, and search
  const fetchMeetings = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/meetings`, {
        params: {
          page: pageNum,
          limit: 10,
          filter: filter !== 'All' ? filter : undefined,
          search: searchTerm || undefined,
        },
      });
      setMeetings(res.data.meetings || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.page || 1);
    } catch (error) {
      console.error('Fetch meetings error:', error.response ? error.response.data : error.message);
      setMeetings([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter, searchTerm]); // Re-fetch when page, filter, or searchTerm changes

  const handleView = (meeting) => setSelectedMeeting(meeting);
  const handleEdit = (meeting) => {
    setEditMeeting(meeting);
    setFormData({
      dateTime: new Date(meeting.dateTime).toISOString().slice(0, 16),
      status: meeting.status || 'Upcoming',
      type: meeting.type || '',
      buyerName: meeting.buyerName || '',
      brand: meeting.brand || '',
      dept: meeting.dept || '',
      title: meeting.title || '',
      meetingDate: new Date(meeting.meetingDate).toISOString().split('T')[0],
    });
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://localhost:5000/api/meetings/${id}`);
        fetchMeetings(page);
        setSelectedMeeting(null); // Clear view mode after deletion
        setActionMenu(null);
      } catch (error) {
        console.error('Delete error:', error.response ? error.response.data : error.message);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.meetingDate || !formData.dateTime) {
      alert('Title, Meeting Date, and Date Time are required');
      return;
    }
    try {
      const payload = {
        ...formData,
        dateTime: new Date(formData.dateTime).toISOString(),
        meetingDate: formData.meetingDate,
      };
      if (editMeeting && editMeeting._id) {
        await axios.put(`http://localhost:5000/api/meetings/${editMeeting._id}`, payload);
      } else if (createMeeting) {
        await axios.post('http://localhost:5000/api/meetings', payload);
      }
      setEditMeeting(null);
      setCreateMeeting(false);
      setFormData({
        dateTime: '',
        status: 'Upcoming',
        type: '',
        buyerName: '',
        brand: '',
        dept: '',
        title: '',
        meetingDate: '',
      });
      fetchMeetings(page);
      setSelectedMeeting(null); // Clear view mode after save
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  // Filter meetings client-side (if backend filtering isn't implemented)
  const filteredMeetings = meetings.filter(meeting =>
    (filter === 'All' || meeting.status === filter) &&
    (meeting.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     meeting.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     meeting.brand?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Dynamic counts based on filtered data
  const draftCount = filteredMeetings.filter(m => m.status === 'Draft').length;
  const archiveCount = filteredMeetings.filter(m => m.status === 'Archive').length;
  const allCount = filteredMeetings.length;

  const [formData, setFormData] = useState({ // Moved inside to fix redeclaration
    dateTime: '',
    status: 'Upcoming',
    type: '',
    buyerName: '',
    brand: '',
    dept: '',
    title: '',
    meetingDate: '',
  });
  const [actionMenu, setActionMenu] = useState(null); // Moved inside to fix redeclaration

  return (
    <div className="meeting-list">
      <h3>Buyer Meetings</h3>
      <input
        type="text"
        placeholder="Search Meetings..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="add-meeting-btn" onClick={() => setCreateMeeting(true)}>
        <span>+</span> Add New Meeting
      </button>

      <div className="filter-tabs">
        <button
          className={filter === 'All' ? 'active' : ''}
          onClick={() => setFilter('All')}
        >
          All <span className="count">{allCount}</span>
        </button>
        <button
          className={filter === 'Draft' ? 'active' : ''}
          onClick={() => setFilter('Draft')}
        >
          Draft <span className="count">{draftCount}</span>
        </button>
        <button
          className={filter === 'Archive' ? 'active' : ''}
          onClick={() => setFilter('Archive')}
        >
          Archive <span className="count">{archiveCount}</span>
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Type</th>
                <th>Buyer Name</th>
                <th>Brand</th>
                <th>Dept.</th>
                <th>Title</th>
                <th>Meeting Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeetings.map((meeting) => (
                <tr key={meeting._id}>
                  <td>{new Date(meeting.dateTime).toLocaleString()}</td>
                  <td>
                    <span className={`status-${meeting.status.toLowerCase()}`}>
                      {meeting.status}
                    </span>
                  </td>
                  <td>{meeting.type}</td>
                  <td>{meeting.buyerName}</td>
                  <td>{meeting.brand}</td>
                  <td>{meeting.dept}</td>
                  <td>{meeting.title}</td>
                  <td>{new Date(meeting.meetingDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="action-dot"
                      onClick={(e) => {
                        e.preventDefault();
                        setActionMenu(actionMenu === meeting._id ? null : meeting._id);
                      }}
                    >
                      ⋮
                    </button>
                    {actionMenu === meeting._id && (
                      <div className="action-menu">
                        <button onClick={() => { handleView(meeting); setActionMenu(null); }}>View</button>
                        <button onClick={() => { handleEdit(meeting); setActionMenu(null); }}>Edit</button>
                        <button onClick={() => { handleDelete(meeting._id); setActionMenu(null); }}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </>
      )}
      {/* View Mode: Read-only display */}
      {selectedMeeting && !editMeeting && !createMeeting && (
        <div className="meeting-details">
          <h4>View Meeting</h4>
          <div>
            <p><strong>Date & Time:</strong> {new Date(selectedMeeting.dateTime).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedMeeting.status}</p>
            <p><strong>Type:</strong> {selectedMeeting.type || 'N/A'}</p>
            <p><strong>Buyer Name:</strong> {selectedMeeting.buyerName || 'N/A'}</p>
            <p><strong>Brand:</strong> {selectedMeeting.brand || 'N/A'}</p>
            <p><strong>Dept.:</strong> {selectedMeeting.dept || 'N/A'}</p>
            <p><strong>Title:</strong> {selectedMeeting.title}</p>
            <p><strong>Meeting Date:</strong> {new Date(selectedMeeting.meetingDate).toLocaleDateString()}</p>
            <button onClick={() => setSelectedMeeting(null)}>Close</button>
          </div>
        </div>
      )}
      {/* Edit/Create Mode: Editable form */}
      {(editMeeting || createMeeting) && (
        <div className="meeting-details">
          <h4>{createMeeting ? 'Create Meeting' : 'Edit Meeting'}</h4>
          <form onSubmit={handleSubmit}>
            <input
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
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
              <option value="Draft">Draft</option>
              <option value="Archive">Archive</option>
            </select>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
            <input
              type="text"
              value={formData.buyerName}
              onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
              placeholder="Buyer Name"
            />
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="Brand"
            />
            <input
              type="text"
              value={formData.dept}
              onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
              placeholder="Dept."
            />
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Title"
              required
            />
            <input
              type="date"
              value={formData.meetingDate}
              onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
              required
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => { setEditMeeting(null); setCreateMeeting(false); setSelectedMeeting(null); }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MeetingList;