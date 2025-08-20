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

  const handleProfile = () => setActiveView('Users');
  const handleLogout = () => {
    alert('Logged out');
    setActiveView('Dashboard');
  };

  const renderView = () => {
    switch (activeView) {
      case 'Users':
        return (
          <div>
            <h3>Users</h3>
            <ul>
              {users.map((user) => (
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
        return <MeetingList meetings={meetings} fetchMeetings={fetchMeetings} />;
      case 'Notifications':
        return <Notifications notifications={notifications} fullView={true} />;
      case 'Chat':
        return <Chat chats={chats} fullView={true} />;
      case 'ActionItems':
        return <ActionItems actionItems={actionItems} fetchActionItems={fetchActionItems} />;
      default:
        return (
          <>
            <MeetingList meetings={meetings} fetchMeetings={fetchMeetings} />
            <ActionItems actionItems={actionItems} fetchActionItems={fetchActionItems} />
            <div>
              <button onClick={() => setActiveView('Notifications')}>View All Notifications</button>
              <Notifications notifications={notifications.slice(0, 3)} />
            </div>
            <div>
              <button onClick={() => setActiveView('Chat')}>View All Chats</button>
              <Chat chats={chats.slice(0, 3)} />
            </div>
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
        <div className="header">
          <input type="text" placeholder="Search anything here..." />
          <ProfileDropdown onProfile={handleProfile} onLogout={handleLogout} />
        </div>
        {renderView()}
      </div>
    </div>
  );
}

export default Dashboard;