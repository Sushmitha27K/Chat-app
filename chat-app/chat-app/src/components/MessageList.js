import React from 'react';

const MessageList = ({ messages, currentUser }) => {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.user === currentUser ? 'user' : 'other'}`}>
          <strong>{message.user}:</strong> {message.text}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
