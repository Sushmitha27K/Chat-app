import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const socket = io('http://localhost:5000');

const ChatApp = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/messages')
      .then(response => {
        setMessages(response.data);
      });

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => socket.off('message');
  }, []);

  const sendMessage = (messageText) => {
    const message = { user: 'User', text: messageText };
    axios.post('http://localhost:5000/messages', message)
      .then(response => {
        socket.emit('message', response.data);
      });
  };

  return (
    <div className="chat-app">
      <MessageList messages={messages} />
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatApp;
