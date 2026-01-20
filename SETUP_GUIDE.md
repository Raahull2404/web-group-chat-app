# Getting Started Guide

## Prerequisites

- Node.js (v14.0.0 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm or yarn package manager

## Project Structure

```
web-group-chat-app/
├── server.js                 # Express + Socket.io server
├── package.json             # Backend dependencies
├── .env.example             # Environment variables template
├── README.md                # Project documentation
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ChatRoom.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── RoomList.js
│   │   │   └── UserList.js
│   │   ├── services/        # API and Socket services
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── styles/          # CSS stylesheets
│   │   │   ├── app.css
│   │   │   ├── auth.css
│   │   │   ├── chatroom.css
│   │   │   ├── roomlist.css
│   │   │   ├── userlist.css
│   │   │   └── index.css
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   ├── public/
│   │   └── index.html       # HTML template
│   └── package.json         # Frontend dependencies
└── web-chat-app/            # Legacy static version
```

## Backend Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `express`: Web framework
- `socket.io`: Real-time communication
- `mongoose`: MongoDB ODM
- `cors`: Cross-origin support
- `bcryptjs`: Password hashing
- `jsonwebtoken`: Authentication tokens
- `dotenv`: Environment variables

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your settings:

```
MONGODB_URI=mongodb://localhost:27017/chat-app
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3000
```

### 3. MongoDB Setup

#### Option A: Local MongoDB

```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get connection string
5. Add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/chat-app
   ```

### 4. Start Backend Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to Client Directory

```bash
cd client
```

### 2. Install Dependencies

```bash
npm install
```

Dependencies include:
- `react`: UI library
- `react-router-dom`: Navigation
- `socket.io-client`: Real-time client
- `axios`: HTTP client
- `react-icons`: Icon library

### 3. Start Frontend Server

```bash
npm start
```

The React app will open on `http://localhost:3000`

## Running the Application

### Option 1: Separate Terminals

**Terminal 1 (Backend):**
```bash
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm start
```

### Option 2: From Root Directory

```bash
# Backend
npm run server

# Frontend (in new terminal)
npm run client
```

## Features

### Authentication
- User registration with email and password
- Secure login
- Session management with localStorage

### Real-time Chat
- Create new chat rooms
- Join existing rooms
- Send messages in real-time
- View online users
- Typing indicators
- Message history with timestamps

### Responsive Design
- Desktop layout (full width display)
- Tablet layout (adjusted proportions)
- Mobile layout (stacked components)
- Touch-friendly interface

## API Endpoints

### Authentication
```
POST /api/register
Body: { username, email, password }

POST /api/login
Body: { email, password }
```

### Rooms
```
GET /api/rooms
GET /api/rooms/:id

POST /api/rooms
Body: { name, description, userId }
```

### Messages
```
GET /api/messages/:room
POST /api/messages
Body: { userId, content, room }
```

## Socket Events

### Emit Events (Client → Server)
- `user-join`: Join the chat
- `create-room`: Create a room
- `join-room`: Join a specific room
- `send-message`: Send a message
- `typing`: User is typing
- `stop-typing`: User stopped typing
- `leave-room`: Leave a room

### Listen Events (Server → Client)
- `user-joined`: User joined event
- `user-connected`: New user connected
- `new-message`: New message received
- `user-typing`: Someone is typing
- `user-stop-typing`: Someone stopped typing
- `room-created`: Room created
- `user-disconnected`: User disconnected
- `users-list`: Updated users list

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 5000 (macOS/Linux)
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify firewall settings for MongoDB Atlas

### Socket.io Connection Issues
- Check CORS configuration in `server.js`
- Ensure both servers are running
- Check browser console for errors

### React Build Issues
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm start
```

## Development Tips

1. **Enable Redux DevTools** for state debugging
2. **Use React DevTools** browser extension
3. **Check Network tab** for API requests
4. **Monitor WebSocket** in Developer Tools
5. **Use Console** for debugging messages

## Performance Optimization

1. **Lazy Load Components**: Use `React.lazy()` for code splitting
2. **Memoize Components**: Use `React.memo()` for optimization
3. **Optimize Images**: Compress user avatars
4. **Cache Messages**: Implement message pagination
5. **Database Indexes**: Index frequently queried fields

## Security Considerations

1. **Hash Passwords**: Use bcryptjs before storing
2. **JWT Tokens**: Implement for stateless auth
3. **HTTPS**: Use in production
4. **Input Validation**: Validate all inputs
5. **Rate Limiting**: Implement to prevent abuse
6. **CORS Configuration**: Restrict to trusted origins

## Deployment

### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=<your-mongodb-uri>

# Deploy
git push heroku main
```

### Vercel Deployment (Frontend)

```bash
npm install -g vercel

cd client
vercel
```

## Next Steps

1. Add user profiles with avatars
2. Implement message reactions (emoji)
3. Add file/image sharing
4. Create voice/video calling
5. Add user roles and permissions
6. Implement message editing/deletion
7. Add dark/light theme toggle
8. Create admin dashboard

## Support

For issues or questions:
1. Check error messages in browser console
2. Review server logs
3. Check MongoDB connection
4. Verify Socket.io configuration
5. Test API endpoints with Postman

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Socket.io Documentation](https://socket.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
