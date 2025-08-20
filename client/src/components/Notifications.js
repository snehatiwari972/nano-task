import React from 'react';

function Notifications({ notifications, fullView = false }) {
  return (
    <div className="notifications">
      <h4>Notifications</h4>
      <ul>
        {(fullView ? notifications : notifications.slice(0, 3)).map((note, index) => (
          <li key={index}>{note.message} {note.time}</li>
        ))}
      </ul>
      {!fullView && notifications.length > 3 && <button>View All</button>}
    </div>
  );
}

export default Notifications;