# Web Group Chat App - MERN Stack

This is a real-time interactive group chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io.

## Features

- **Real-time Messaging**: Instant message delivery using Socket.io
- **Multiple Chat Rooms**: Create and join different chat rooms
- **User Authentication**: Secure user registration and login
- **Typing Indicators**: See when other users are typing
- **Responsive Design**: Works seamlessly on mobile and desktop
- **User Presence**: See who's online in real-time
- **Message History**: Persistent message storage with MongoDB

## Tech Stack

### Backend
- **Express.js**: Web framework for Node.js
- **Socket.io**: Real-time bidirectional communication
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: User authentication
- **CORS**: Cross-origin resource sharing

### Frontend (React)
- **React**: UI library
- **Socket.io Client**: Real-time client communication
- **Axios**: HTTP client
- **React Router**: Navigation
- **Tailwind CSS**: Styling

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Backend Setup

```bash
# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/chat-app" > .env
echo "PORT=5000" >> .env

# Start development server
npm run dev

# Or start production server
npm start
```

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start React development server
npm start
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create new room

### Messages
- `GET /api/messages/:room` - Get room messages
- `POST /api/messages` - Send message

## Socket.io Events

### Client to Server
- `user-join` - User joins the chat
- `create-room` - Create a new room
- `join-room` - Join existing room
- `send-message` - Send message to room
- `typing` - User is typing
- `stop-typing` - User stopped typing
- `leave-room` - Leave a room

### Server to Client
- `user-joined` - User joined event
- `user-connected` - New user connected
- `room-created` - Room created event
- `new-message` - New message received
- `user-typing` - User typing indicator
- `user-stop-typing` - User stopped typing
- `user-joined-room` - User joined room
- `user-left-room` - User left room
- `user-disconnected` - User disconnected
- `users-list` - Active users list

## Project Structure

```
web-group-chat-app/
├── server.js                 # Express server with Socket.io
├── package.json             # Backend dependencies
├── .env                     # Environment variables
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── App.js          # Main app component
│   │   └── index.js        # React entry point
│   └── package.json        # Frontend dependencies
└── web-chat-app/           # Legacy static HTML version
```

## Usage

1. Start the backend server:
   ```bash
   npm run dev
   ```

2. Start the React frontend:
   ```bash
   cd client
   npm start
   ```

3. Open `http://localhost:3000` in your browser

4. Register/Login with your account

5. Create a room or join an existing one

6. Start chatting!

## Responsive Design

The app is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets (iPad, Android tablets)
- Mobile devices (iOS, Android)

## Database Models

### User
```javascript
{
  username: String,
  email: String,
  password: String,
  avatar: String,
  createdAt: Date
}
```

### Message
```javascript
{
  sender: ObjectId,
  content: String,
  room: String,
  createdAt: Date
}
```

### Room
```javascript
{
  name: String,
  description: String,
  createdBy: ObjectId,
  members: [ObjectId],
  createdAt: Date
}
```

## Development Notes

- Update `.env` with your MongoDB connection string
- Socket.io is configured for CORS with localhost:3000 and localhost:5000
- Messages are persisted in MongoDB
- Real-time updates use WebSocket connections

## Future Enhancements

- User profiles and avatars
- Message editing and deletion
- File/image sharing
- Voice and video calls
- User roles and permissions
- Message reactions and emojis
- Search functionality
- Dark/Light theme

## License

ISC

## Author

Rahul Sharma
