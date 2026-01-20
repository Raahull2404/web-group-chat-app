import React, { useState, useEffect } from 'react';
import { socketService } from '../services/socket';
import '../styles/userlist.css';
import { FiLogOut } from 'react-icons/fi';

const UserList = ({ currentUser, onLogout }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const socket = socketService.connect();

    socket.emit('user-join', {
      username: currentUser.username,
      avatar: currentUser.avatar || ''
    });

    socket.on('users-list', (usersList) => {
      setUsers(usersList);
    });

    socket.on('user-connected', (user) => {
      setUsers(prev => [...prev, user]);
    });

    socket.on('user-disconnected', (user) => {
      setUsers(prev => prev.filter(u => u.id !== user?.id));
    });

    return () => {
      socket.off('users-list');
      socket.off('user-connected');
      socket.off('user-disconnected');
    };
  }, [currentUser]);

  return (
    <div className="userlist-container">
      <div className="userlist-header">
        <h3>Online Users ({users.length})</h3>
      </div>

      <div className="current-user">
        <div className="user-avatar">
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt={currentUser.username} />
          ) : (
            <div className="avatar-placeholder">
              {currentUser.username[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="user-info">
          <p className="username">{currentUser.username}</p>
          <p className="status">You</p>
        </div>
        <button className="btn-logout" onClick={onLogout}>
          <FiLogOut />
        </button>
      </div>

      <div className="users-list">
        {users.filter(u => u.username !== currentUser.username).map(user => (
          <div key={user.id} className="user-item">
            <div className="user-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <div className="avatar-placeholder">
                  {user.username[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="user-info">
              <p className="username">{user.username}</p>
              <span className="online-status">● Online</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
