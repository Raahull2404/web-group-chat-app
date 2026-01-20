# API Documentation

## Base URL

**Development**: `http://localhost:5000`  
**Production**: `https://api.yourdomain.com`

## Authentication

Currently using localStorage for session management. JWT implementation ready for production.

Headers required for authenticated requests:
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Authentication Endpoints

### Register User

**Endpoint**: `POST /api/register`

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (201)**:
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "",
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

**Error Response (400)**:
```json
{
  "error": "User already exists"
}
```

---

### Login User

**Endpoint**: `POST /api/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "",
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

**Error Response (401)**:
```json
{
  "error": "Invalid credentials"
}
```

---

## Room Endpoints

### Get All Rooms

**Endpoint**: `GET /api/rooms`

**Query Parameters**: None

**Success Response (200)**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "General Chat",
    "description": "General discussion room",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "admin"
    },
    "members": [
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439013"
    ],
    "createdAt": "2024-01-20T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Tech Discussion",
    "description": "Technical topics",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "admin"
    },
    "members": ["507f1f77bcf86cd799439011"],
    "createdAt": "2024-01-20T11:00:00Z"
  }
]
```

**Error Response (400)**:
```json
{
  "error": "Failed to fetch rooms"
}
```

---

### Create Room

**Endpoint**: `POST /api/rooms`

**Request Body**:
```json
{
  "name": "New Room",
  "description": "Room description",
  "userId": "507f1f77bcf86cd799439011"
}
```

**Success Response (201)**:
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "name": "New Room",
  "description": "Room description",
  "createdBy": "507f1f77bcf86cd799439011",
  "members": ["507f1f77bcf86cd799439011"],
  "createdAt": "2024-01-20T12:00:00Z"
}
```

**Error Response (400)**:
```json
{
  "error": "Room name already exists"
}
```

---

### Get Room by ID

**Endpoint**: `GET /api/rooms/:id`

**URL Parameters**:
- `id` (string): Room ID

**Success Response (200)**:
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "General Chat",
  "description": "General discussion room",
  "createdBy": "507f1f77bcf86cd799439011",
  "members": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439013"],
  "createdAt": "2024-01-20T10:30:00Z"
}
```

**Error Response (404)**:
```json
{
  "error": "Room not found"
}
```

---

## Message Endpoints

### Get Messages by Room

**Endpoint**: `GET /api/messages/:room`

**URL Parameters**:
- `room` (string): Room name

**Query Parameters** (optional):
- `limit` (number): Number of messages to return (default: 50)
- `skip` (number): Number of messages to skip for pagination (default: 0)

**Success Response (200)**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "sender": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "avatar": ""
    },
    "content": "Hello everyone!",
    "room": "General Chat",
    "createdAt": "2024-01-20T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439021",
    "sender": {
      "_id": "507f1f77bcf86cd799439013",
      "username": "janedoe",
      "avatar": ""
    },
    "content": "Hi there!",
    "room": "General Chat",
    "createdAt": "2024-01-20T10:31:00Z"
  }
]
```

**Error Response (400)**:
```json
{
  "error": "Failed to fetch messages"
}
```

---

### Send Message

**Endpoint**: `POST /api/messages`

**Request Body**:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "content": "Hello world!",
  "room": "General Chat"
}
```

**Success Response (201)**:
```json
{
  "_id": "507f1f77bcf86cd799439022",
  "sender": "507f1f77bcf86cd799439011",
  "content": "Hello world!",
  "room": "General Chat",
  "createdAt": "2024-01-20T10:32:00Z"
}
```

**Error Response (400)**:
```json
{
  "error": "Message content is required"
}
```

---

## Socket.io Events

### Client → Server Events

#### `user-join`
**Purpose**: Register user when they connect

**Data**:
```javascript
{
  username: "johndoe",
  avatar: "https://example.com/avatar.jpg"
}
```

---

#### `create-room`
**Purpose**: Create a new chat room

**Data**:
```javascript
{
  name: "New Room",
  description: "Room description",
  userId: "507f1f77bcf86cd799439011"
}
```

---

#### `join-room`
**Purpose**: Join an existing room

**Data**:
```javascript
{
  roomId: "507f1f77bcf86cd799439012",
  roomName: "General Chat",
  userId: "507f1f77bcf86cd799439011"
}
```

---

#### `send-message`
**Purpose**: Send a message to a room

**Data**:
```javascript
{
  userId: "507f1f77bcf86cd799439011",
  content: "Hello everyone!",
  room: "General Chat"
}
```

---

#### `typing`
**Purpose**: Notify others that user is typing

**Data**:
```javascript
{
  room: "General Chat"
}
```

---

#### `stop-typing`
**Purpose**: Notify others that user stopped typing

**Data**:
```javascript
{
  room: "General Chat"
}
```

---

#### `leave-room`
**Purpose**: Leave a room

**Data**:
```javascript
{
  room: "General Chat"
}
```

---

### Server → Client Events

#### `user-joined`
**Purpose**: Confirm user joined

**Data**:
```javascript
{
  message: "You joined the chat"
}
```

---

#### `user-connected`
**Purpose**: Notify of new user connection

**Data**:
```javascript
{
  id: "socket-id",
  username: "johndoe",
  avatar: "https://example.com/avatar.jpg"
}
```

---

#### `users-list`
**Purpose**: Send list of all connected users

**Data**:
```javascript
[
  {
    id: "socket-id-1",
    username: "johndoe",
    avatar: ""
  },
  {
    id: "socket-id-2",
    username: "janedoe",
    avatar: ""
  }
]
```

---

#### `new-message`
**Purpose**: Broadcast new message to room

**Data**:
```javascript
{
  id: "507f1f77bcf86cd799439022",
  sender: "johndoe",
  senderAvatar: "",
  content: "Hello everyone!",
  timestamp: "2024-01-20T10:32:00Z",
  room: "General Chat"
}
```

---

#### `user-typing`
**Purpose**: Notify that user is typing

**Data**:
```javascript
{
  username: "johndoe",
  room: "General Chat"
}
```

---

#### `user-stop-typing`
**Purpose**: Notify that user stopped typing

**Data**:
```javascript
{
  username: "johndoe",
  room: "General Chat"
}
```

---

#### `room-created`
**Purpose**: Broadcast new room creation

**Data**:
```javascript
{
  _id: "507f1f77bcf86cd799439015",
  name: "New Room",
  description: "Room description",
  createdBy: "507f1f77bcf86cd799439011",
  members: ["507f1f77bcf86cd799439011"],
  createdAt: "2024-01-20T12:00:00Z"
}
```

---

#### `user-joined-room`
**Purpose**: Notify room members of new user

**Data**:
```javascript
{
  username: "johndoe",
  message: "johndoe joined the room"
}
```

---

#### `user-left-room`
**Purpose**: Notify room members of user leaving

**Data**:
```javascript
{
  username: "johndoe",
  message: "johndoe left the room"
}
```

---

#### `user-disconnected`
**Purpose**: Notify of user disconnection

**Data**:
```javascript
{
  id: "socket-id",
  username: "johndoe",
  avatar: ""
}
```

---

## Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 400 | Bad Request | Invalid request body or parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Internal server error |

---

## Rate Limiting

Currently not implemented. Recommended for production:
- 100 requests per minute per IP
- 10 messages per second per user
- 5 room creations per hour per user

---

## Example Usage

### Using Axios (Frontend)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Register
const register = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

// Get all rooms
const getRooms = async () => {
  const response = await api.get('/rooms');
  return response.data;
};

// Get messages
const getMessages = async (roomName) => {
  const response = await api.get(`/messages/${roomName}`);
  return response.data;
};
```

### Using Socket.io (Frontend)

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Connect and join
socket.on('connect', () => {
  socket.emit('user-join', {
    username: 'johndoe',
    avatar: ''
  });
});

// Listen for messages
socket.on('new-message', (message) => {
  console.log('New message:', message);
});

// Send message
socket.emit('send-message', {
  userId: userId,
  content: 'Hello!',
  room: 'General Chat'
});
```

---

## Changelog

### Version 1.0.0 (2024-01-20)
- Initial release
- User authentication
- Real-time messaging
- Multiple chat rooms
- Socket.io integration
- Responsive design

---

## Support

For API issues or questions, please refer to the [README.md](README.md) or [FEATURES.md](FEATURES.md) files.
