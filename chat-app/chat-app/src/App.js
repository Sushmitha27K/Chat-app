import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import './App.css';

const socket = io('http://localhost:5000');

const App = () => {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState('User1');

  useEffect(() => {
    // Fetch initial messages from the server
    axios.get('http://localhost:5000/messages')
      .then(response => {
        setMessages(response.data);
      });

    // Listen for new messages
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the socket connection
    return () => socket.off('message');
  }, []);

  const sendMessage = (messageText) => {
    const message = { user: currentUser, text: messageText };
    axios.post('http://localhost:5000/messages', message)
      .then(response => {
        // No need to add the message to state here, as the server will emit it
      });
  };

  const toggleUser = () => {
    setCurrentUser(currentUser === 'Sushmitha' ? 'Jaanu' : 'Sushmitha');
  };

  return (
    <div className="chat-app">
      <div className="header">
        Chat App - {currentUser}
        <button onClick={toggleUser} className="toggle-user">
          Switch to {currentUser === 'Sushmitha' ? 'Jaanu' : 'Sushmitha'}
        </button>
      </div>
      <MessageList messages={messages} currentUser={currentUser} />
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};

export default App;
