import React from 'react';

function Notifications({ notifications, fullView = false, onViewAll, onAdd }) {
  return (
    <div className="notifications">
      <h4>Notifications</h4>
      <div className="button-group">
        <button onClick={onViewAll}>View All Notifications</button>
        <button onClick={onAdd}>Add Notification</button>
      </div>
      <ul>
        {(fullView ? notifications : notifications.slice(0, 3)).map((note, index) => (
          <li key={index}>{note.message} {note.time}</li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;