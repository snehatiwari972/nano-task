import React, { useState } from 'react';

function ProfileDropdown({ onProfile, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (action) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="profile-dropdown" onClick={() => setIsOpen(!isOpen)}>
      <button>Profile</button>
      {isOpen && (
        <ul>
          <li onClick={() => handleClick(onProfile)}>Profile</li>
          <li onClick={() => handleClick(onLogout)}>Logout</li>
        </ul>
      )}
    </div>
  );
}

export default ProfileDropdown;