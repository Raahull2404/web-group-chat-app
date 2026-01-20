import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { socketService } from './services/socket';
import Login from './components/Login';
import Register from './components/Register';
import ChatRoom from './components/ChatRoom';
import RoomList from './components/RoomList';
import UserList from './components/UserList';
import './styles/app.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setSelectedRoom(null);
    socketService.disconnect();
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/"
          element={
            currentUser ? (
              <div className="app-container">
                <div className="sidebar">
                  <UserList 
                    currentUser={currentUser} 
                    onLogout={handleLogout}
                  />
                </div>

                <div className="main-content">
                  <div className="rooms-section">
                    <RoomList 
                      currentUser={currentUser}
                      onSelectRoom={setSelectedRoom}
                      onCreateRoom={setSelectedRoom}
                    />
                  </div>

                  <div className="chat-section">
                    {selectedRoom ? (
                      <ChatRoom
                        room={selectedRoom}
                        currentUser={currentUser}
                        onLeaveRoom={() => setSelectedRoom(null)}
                      />
                    ) : (
                      <div className="no-room-selected">
                        <h2>Welcome to Chat App</h2>
                        <p>Select or create a room to start chatting</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
