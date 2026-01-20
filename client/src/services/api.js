import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const authService = {
  register: (userData) => axios.post(`${API_URL}/register`, userData),
  login: (credentials) => axios.post(`${API_URL}/login`, credentials)
};

export const roomService = {
  getAllRooms: () => axios.get(`${API_URL}/rooms`),
  createRoom: (roomData) => axios.post(`${API_URL}/rooms`, roomData),
  joinRoom: (roomId) => axios.post(`${API_URL}/rooms/${roomId}/join`)
};

export const messageService = {
  getMessages: (room) => axios.get(`${API_URL}/messages/${room}`),
  sendMessage: (messageData) => axios.post(`${API_URL}/messages`, messageData)
};
