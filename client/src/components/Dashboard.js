import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MeetingList from './MeetingList';
import Notifications from './Notifications';
import Chat from './Chat';
import ActionItems from './ActionItems';
import ProfileDropdown from './ProfileDropdown';

function Dashboard() {
  const [activeView, setActiveView] = useState('Dashboard');
  const [users, setUsers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [chats, setChats] = useState([]);
  const [newUserForm, setNewUserForm] = useState(false);
  const [userFormData, setUserFormData] = useState({ name: '', email: '' });
  const [newNotificationForm, setNewNotificationForm] = useState(false);
  const [notificationFormData, setNotificationFormData] = useState({ message: '', time: '' });
  const [newChatForm, setNewChatForm] = useState(false);
  const [chatFormData, setChatFormData] = useState({ message: '', time: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchMeetings();
    fetchActionItems();
    fetchNotifications();
    fetchChats();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:5000/api/users');
    setUsers(response.data);
  };

  const fetchMeetings = async () => {
    const response = await axios.get('http://localhost:5000/api/meetings');
    setMeetings(response.data);
  };

  const fetchActionItems = async () => {
    const response = await axios.get('http://localhost:5000/api/action-items');
    setActionItems(response.data);
  };

  const fetchNotifications = async () => {
    const response = await axios.get('http://localhost:5000/api/notifications');
    setNotifications(response.data);
  };

  const fetchChats = async () => {
    const response = await axios.get('http://localhost:5000/api/chats');
    setChats(response.data);
  };

  const createUser = async () => {
    try {
      if (!userFormData.name || !userFormData.email) {
        alert('Name and Email are required');
        return;
      }
      await axios.post('http://localhost:5000/api/users', userFormData);
      setNewUserForm(false);
      setUserFormData({ name: '', email: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error.response ? error.response.data : error.message);
    }
  };

  const createNotification = async () => {
    try {
      if (!notificationFormData.message || !notificationFormData.time) {
        alert('Message and Time are required');
        return;
      }
      await axios.post('http://localhost:5000/api/notifications', notificationFormData);
      setNewNotificationForm(false);
      setNotificationFormData({ message: '', time: '' });
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error.response ? error.response.data : error.message);
    }
  };

  const createChat = async () => {
    try {
      if (!chatFormData.message || !chatFormData.time) {
        alert('Message and Time are required');
        return;
      }
      await axios.post('http://localhost:5000/api/chats', chatFormData);
      setNewChatForm(false);
      setChatFormData({ message: '', time: '' });
      fetchChats();
    } catch (error) {
      console.error('Error creating chat:', error.response ? error.response.data : error.message);
    }
  };

  const handleProfile = () => setActiveView('Users');
  const handleLogout = () => {
    alert('Logged out');
    setActiveView('Dashboard');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredMeetings = meetings && meetings.length
    ? meetings.filter(meeting =>
        meeting.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  const filteredByStatus = filteredMeetings.filter(meeting =>
    filter === 'All' || meeting.status === filter
  );
  const currentMeetings = filteredByStatus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredByStatus.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderView = () => {
    switch (activeView) {
      case 'Users':
        return (
          <div>
            <h3>Users</h3>
            <input
              type="text"
              placeholder="Search Users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
              {users
                .filter(user =>
                  user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <li key={user._id}>{user.name} - {user.email}</li>
                ))}
            </ul>
            {newUserForm ? (
              <form onSubmit={(e) => { e.preventDefault(); createUser(); }}>
                <input
                  type="text"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  placeholder="Name"
                  required
                />
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  placeholder="Email"
                  required
                />
                <button type="submit">Save</button>
                <button onClick={() => setNewUserForm(false)}>Cancel</button>
              </form>
            ) : (
              <button onClick={() => setNewUserForm(true)}>Add User</button>
            )}
          </div>
        );
      case 'Buyer Meeting':
        return <MeetingList meetings={currentMeetings} fetchMeetings={fetchMeetings} filter={filter} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case 'Notifications':
        return (
          <div>
            <input
              type="text"
              placeholder="Search Notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setNewNotificationForm(true)}>Add Notification</button>
            {newNotificationForm && (
              <form onSubmit={(e) => { e.preventDefault(); createNotification(); }}>
                <input
                  type="text"
                  value={notificationFormData.message}
                  onChange={(e) => setNotificationFormData({ ...notificationFormData, message: e.target.value })}
                  placeholder="Message"
                  required
                />
                <input
                  type="text"
                  value={notificationFormData.time}
                  onChange={(e) => setNotificationFormData({ ...notificationFormData, time: e.target.value })}
                  placeholder="Time (e.g., 10 mins ago)"
                  required
                />
                <button type="submit">Save</button>
                <button onClick={() => setNewNotificationForm(false)}>Cancel</button>
              </form>
            )}
            <Notifications notifications={notifications.filter(n => n.message?.toLowerCase().includes(searchTerm.toLowerCase()))} fullView={true} />
          </div>
        );
      case 'Chat':
        return (
          <div>
            <input
              type="text"
              placeholder="Search Chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setNewChatForm(true)}>Add Chat</button>
            {newChatForm && (
              <form onSubmit={(e) => { e.preventDefault(); createChat(); }}>
                <input
                  type="text"
                  value={chatFormData.message}
                  onChange={(e) => setChatFormData({ ...chatFormData, message: e.target.value })}
                  placeholder="Message"
                  required
                />
                <input
                  type="text"
                  value={chatFormData.time}
                  onChange={(e) => setChatFormData({ ...chatFormData, time: e.target.value })}
                  placeholder="Time (e.g., 10 mins ago)"
                  required
                />
                <button type="submit">Save</button>
                <button onClick={() => setNewChatForm(false)}>Cancel</button>
              </form>
            )}
            <Chat chats={chats.filter(c => c.message?.toLowerCase().includes(searchTerm.toLowerCase()))} fullView={true} />
          </div>
        );
      case 'ActionItems':
        return <ActionItems actionItems={actionItems} fetchActionItems={fetchActionItems} />;
      default:
        return (
    <>
      <MeetingList meetings={currentMeetings} fetchMeetings={fetchMeetings} filter={filter} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ActionItems actionItems={actionItems} fetchActionItems={fetchActionItems} />
      <Notifications
        notifications={notifications.slice(0, 3).filter(n => n.message?.toLowerCase().includes(searchTerm.toLowerCase()))}
        onViewAll={() => setActiveView('Notifications')}
        onAdd={() => setNewNotificationForm(true)}
      />
      <Chat
        chats={chats.slice(0, 3).filter(c => c.message?.toLowerCase().includes(searchTerm.toLowerCase()))}
        onViewAll={() => setActiveView('Chat')}
        onAdd={() => setNewChatForm(true)}
      />
    </>
  );
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>ADAM EXPORTS</h2>
        <ul>
          <li onClick={() => setActiveView('Dashboard')} style={{ cursor: 'pointer', fontWeight: activeView === 'Dashboard' ? 'bold' : 'normal' }}>Dashboard</li>
          <li onClick={() => setActiveView('Buyer Meeting')} style={{ cursor: 'pointer', fontWeight: activeView === 'Buyer Meeting' ? 'bold' : 'normal' }}>Buyer Meeting</li>
          <li onClick={() => setActiveView('Users')} style={{ cursor: 'pointer', fontWeight: activeView === 'Users' ? 'bold' : 'normal' }}>Users</li>
          <li onClick={() => setActiveView('Notifications')} style={{ cursor: 'pointer', fontWeight: activeView === 'Notifications' ? 'bold' : 'normal' }}>Notifications</li>
          <li onClick={() => setActiveView('Chat')} style={{ cursor: 'pointer', fontWeight: activeView === 'Chat' ? 'bold' : 'normal' }}>Chat</li>
          <li onClick={() => setActiveView('ActionItems')} style={{ cursor: 'pointer', fontWeight: activeView === 'ActionItems' ? 'bold' : 'normal' }}>Action Items</li>
        </ul>
      </div>
      <div className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <input
              type="text"
              placeholder="Search anything here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="header-right">
            <ProfileDropdown onProfile={handleProfile} onLogout={handleLogout} />
          </div>
        </header>
        {renderView()}
        <footer className="dashboard-footer">
          <div className="pagination-right">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              &laquo; Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={currentPage === number ? 'active' : ''}
              >
                {number}
              </button>
            ))}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              Next &raquo;
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;