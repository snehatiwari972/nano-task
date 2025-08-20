import React from 'react';

function Chat({ chats, fullView = false, onViewAll, onAdd }) {
  return (
    <div className="chat">
      <h4>Chat</h4>
      <div className="button-group">
        <button onClick={onViewAll}>View All Chats</button>
        <button onClick={onAdd}>Add Chat</button>
      </div>
      <ul>
        {(fullView ? chats : chats.slice(0, 3)).map((chat, index) => (
          <li key={index}>{chat.message} {chat.time}</li>
        ))}
      </ul>
    </div>
  );
}

export default Chat;