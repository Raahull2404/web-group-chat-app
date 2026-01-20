import React, { useState, useEffect, useRef } from 'react';
import { socketService } from '../services/socket';
import { messageService } from '../services/api';
import '../styles/chatroom.css';
import { FiSend } from 'react-icons/fi';
import { BiExit } from 'react-icons/bi';

const ChatRoom = ({ room, currentUser, onLeaveRoom }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Load message history
    const loadMessages = async () => {
      try {
        const response = await messageService.getMessages(room.name);
        setMessages(response.data);
        scrollToBottom();
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Join room via socket
    const socket = socketService.connect();
    socket.emit('join-room', {
      roomId: room._id,
      roomName: room.name,
      userId: currentUser._id
    });

    // Listen for new messages
    socket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    // Listen for typing indicators
    socket.on('user-typing', (data) => {
      if (data.room === room.name) {
        setTypingUsers(prev => {
          if (!prev.includes(data.username)) {
            return [...prev, data.username];
          }
          return prev;
        });
      }
    });

    socket.on('user-stop-typing', (data) => {
      if (data.room === room.name) {
        setTypingUsers(prev => prev.filter(u => u !== data.username));
      }
    });

    return () => {
      socket.off('new-message');
      socket.off('user-typing');
      socket.off('user-stop-typing');
    };
  }, [room, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    socketService.emit('typing', { room: room.name });
    
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emit('stop-typing', { room: room.name });
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socketService.emit('send-message', {
        userId: currentUser._id,
        content: input,
        room: room.name
      });
      setInput('');
      socketService.emit('stop-typing', { room: room.name });
    }
  };

  const handleLeaveRoom = () => {
    socketService.emit('leave-room', { room: room.name });
    onLeaveRoom();
  };

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  return (
    <div className="chatroom-container">
      <div className="chatroom-header">
        <div className="room-info">
          <h2>{room.name}</h2>
          <p>{room.description}</p>
        </div>
        <button className="btn-leave" onClick={handleLeaveRoom}>
          <BiExit /> Leave Room
        </button>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === currentUser._id ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p className="sender-name">{msg.sender}</p>
                <p className="message-text">{msg.content}</p>
                <span className="timestamp">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          <p>{typingUsers.join(', ')} is typing...</p>
        </div>
      )}

      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleTyping}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="btn-send">
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
