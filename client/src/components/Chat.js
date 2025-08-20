import React from 'react';

function Chat({ chats, fullView = false }) {
  return (
    <div className="chat">
      <h4>Chat</h4>
      <ul>
        {(fullView ? chats : chats.slice(0, 3)).map((chat, index) => (
          <li key={index}>{chat.message} {chat.time}</li>
        ))}
      </ul>
      {!fullView && chats.length > 3 && <button>View All</button>}
    </div>
  );
}

export default Chat;