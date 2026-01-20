import React, { useState, useEffect } from 'react';
import { roomService } from '../services/api';
import '../styles/roomlist.css';
import { IoAddCircle } from 'react-icons/io5';

const RoomList = ({ currentUser, onSelectRoom, onCreateRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getAllRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await roomService.createRoom({
        ...newRoom,
        userId: currentUser._id
      });
      setRooms([...rooms, response.data]);
      setNewRoom({ name: '', description: '' });
      setShowCreateForm(false);
      onCreateRoom(response.data);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleJoinRoom = (room) => {
    onSelectRoom(room);
  };

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  return (
    <div className="roomlist-container">
      <div className="roomlist-header">
        <h2>Chat Rooms</h2>
        <button 
          className="btn-create"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <IoAddCircle /> New Room
        </button>
      </div>

      {showCreateForm && (
        <form className="create-room-form" onSubmit={handleCreateRoom}>
          <input
            type="text"
            placeholder="Room name"
            value={newRoom.name}
            onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Room description"
            value={newRoom.description}
            onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
          />
          <button type="submit" className="btn-create-submit">Create</button>
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => setShowCreateForm(false)}
          >
            Cancel
          </button>
        </form>
      )}

      <div className="rooms-list">
        {rooms.length === 0 ? (
          <p className="no-rooms">No rooms available. Create one!</p>
        ) : (
          rooms.map(room => (
            <div key={room._id} className="room-card">
              <div className="room-card-content">
                <h3>{room.name}</h3>
                <p>{room.description || 'No description'}</p>
                <span className="room-members">
                  {room.members.length} members
                </span>
              </div>
              <button 
                className="btn-join"
                onClick={() => handleJoinRoom(room)}
              >
                Join
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoomList;
