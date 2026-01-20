const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Models
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  room: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const roomSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);
const Room = mongoose.model('Room', roomSchema);

// Socket.io connection handling
const users = {};
const rooms = {};

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User joins
  socket.on('user-join', (userData) => {
    users[socket.id] = {
      id: socket.id,
      username: userData.username,
      avatar: userData.avatar
    };
    socket.emit('user-joined', { message: 'You joined the chat' });
    socket.broadcast.emit('user-connected', users[socket.id]);
    io.emit('users-list', Object.values(users));
  });

  // Room creation
  socket.on('create-room', async (roomData) => {
    try {
      const newRoom = new Room({
        name: roomData.name,
        description: roomData.description,
        createdBy: roomData.userId,
        members: [roomData.userId]
      });
      await newRoom.save();
      
      rooms[roomData.name] = newRoom;
      socket.join(roomData.name);
      io.emit('room-created', newRoom);
    } catch (error) {
      socket.emit('error', { message: 'Failed to create room' });
    }
  });

  // Join room
  socket.on('join-room', async (roomData) => {
    try {
      const room = await Room.findByIdAndUpdate(
        roomData.roomId,
        { $addToSet: { members: roomData.userId } },
        { new: true }
      );
      
      socket.join(roomData.roomName);
      socket.broadcast.to(roomData.roomName).emit('user-joined-room', {
        username: users[socket.id]?.username,
        message: `${users[socket.id]?.username || 'A user'} joined the room`
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Send message
  socket.on('send-message', async (messageData) => {
    try {
      const newMessage = new Message({
        sender: messageData.userId,
        content: messageData.content,
        room: messageData.room
      });
      await newMessage.save();

      io.to(messageData.room).emit('new-message', {
        id: newMessage._id,
        sender: users[socket.id]?.username || 'Anonymous',
        senderAvatar: users[socket.id]?.avatar || '',
        content: messageData.content,
        timestamp: new Date(),
        room: messageData.room
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.broadcast.to(data.room).emit('user-typing', {
      username: users[socket.id]?.username,
      room: data.room
    });
  });

  socket.on('stop-typing', (data) => {
    socket.broadcast.to(data.room).emit('user-stop-typing', {
      username: users[socket.id]?.username,
      room: data.room
    });
  });

  // Leave room
  socket.on('leave-room', (roomData) => {
    socket.leave(roomData.room);
    socket.broadcast.to(roomData.room).emit('user-left-room', {
      username: users[socket.id]?.username,
      message: `${users[socket.id]?.username || 'A user'} left the room`
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const disconnectedUser = users[socket.id];
    delete users[socket.id];
    io.emit('user-disconnected', disconnectedUser);
    io.emit('users-list', Object.values(users));
  });
});

// REST API Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const user = new User({
      username,
      email,
      password // In production, hash the password
    });
    
    await user.save();
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const allRooms = await Room.find().populate('createdBy', 'username');
    res.status(200).json(allRooms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/messages/:room', async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room })
      .populate('sender', 'username avatar')
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
