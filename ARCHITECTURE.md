# Architecture & System Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  App.js (Router)                                             │   │
│  │  ├── Login Component                                         │   │
│  │  ├── Register Component                                      │   │
│  │  ├── ChatRoom Component                                      │   │
│  │  ├── RoomList Component                                      │   │
│  │  └── UserList Component                                      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Services                                                    │   │
│  │  ├── api.js (Axios HTTP client)                             │   │
│  │  └── socket.js (Socket.io client)                           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Styles (CSS)                                                │   │
│  │  ├── app.css, auth.css, chatroom.css                        │   │
│  │  ├── roomlist.css, userlist.css                             │   │
│  │  └── Responsive for Mobile, Tablet, Desktop                │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
         ↓ HTTP (REST) ↓         ↓ WebSocket (Socket.io) ↓
┌─────────────────────────────────────────────────────────────────────┐
│                  SERVER (Node.js + Express)                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  API Endpoints                                               │   │
│  │  ├── POST /api/register                                      │   │
│  │  ├── POST /api/login                                         │   │
│  │  ├── GET /api/rooms                                          │   │
│  │  └── GET /api/messages/:room                                │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Socket.io Events (18+ Real-time Events)                    │   │
│  │  ├── User Events (join, disconnect, connected)             │   │
│  │  ├── Room Events (create, join, leave)                     │   │
│  │  ├── Message Events (send, broadcast)                      │   │
│  │  └── Typing Events (typing, stop-typing)                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Middleware & Config                                         │   │
│  │  ├── CORS Configuration                                      │   │
│  │  ├── JSON Parser                                             │   │
│  │  ├── Error Handler                                           │   │
│  │  └── Environment Variables                                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
         ↓ MongoDB Driver ↓
┌─────────────────────────────────────────────────────────────────────┐
│                  DATABASE (MongoDB)                                  │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Collections & Schemas                                       │   │
│  │  ├── Users (username, email, password, avatar)              │   │
│  │  ├── Rooms (name, description, createdBy, members)          │   │
│  │  └── Messages (sender, content, room, createdAt)            │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Frontend Architecture

### Component Hierarchy
```
App (Root)
├── Login
├── Register
└── Dashboard
    ├── UserList
    │   ├── Current User
    │   └── Online Users
    ├── RoomList
    │   ├── Create Room Form
    │   └── Room Cards
    └── ChatRoom
        ├── Header
        ├── Messages Container
        ├── Typing Indicator
        └── Message Input Form
```

### Data Flow
```
User Action
    ↓
Component Event Handler
    ↓
Service Call (API/Socket)
    ↓
Backend Processing
    ↓
Database Operation
    ↓
Response/Event
    ↓
Component State Update
    ↓
UI Re-render
```

### State Management
```
App.js
├── currentUser (localStorage)
├── selectedRoom (state)
└── Component Level States
    ├── messages (ChatRoom)
    ├── rooms (RoomList)
    ├── users (UserList)
    ├── formData (Login/Register)
    └── typingUsers (ChatRoom)
```

---

## 🔧 Backend Architecture

### Request Flow
```
HTTP Request
    ↓
Express Middleware
    ↓
CORS Check
    ↓
JSON Parser
    ↓
Route Handler
    ↓
Business Logic
    ↓
MongoDB Query
    ↓
Response/Error
    ↓
Client
```

### Socket.io Event Flow
```
Client Socket Event
    ↓
Server Event Handler
    ↓
Validation/Processing
    ↓
Database Operation (optional)
    ↓
Broadcast to Room/User
    ↓
Client Socket Listener
    ↓
Component Update
    ↓
UI Re-render
```

---

## 🗄️ Database Schema Relationships

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    User     │         │     Room     │         │   Message   │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ _id         │◄────────│ createdBy    │         │ _id         │
│ username    │         │ members[]───────────┐  │ sender────┐ │
│ email       │         │ _id          │      │  │ content   │ │
│ password    │         │ name         │      │  │ room      │ │
│ avatar      │         │ description  │      │  │ createdAt │ │
│ createdAt   │         │ createdAt    │      │  └─────────────┘
└─────────────┘         └──────────────┘      │
      ▲                       ▲                │
      │                       │                │
      └───────────────────────┴────────────────┘
        One User creates      Each Room has
        multiple rooms        multiple members
```

---

## 🔌 Real-time Communication Flow

### Message Sending
```
User Types Message
        ↓
Clicks Send Button
        ↓
emit('send-message', {userId, content, room})
        ↓
Server Receives Event
        ↓
Save to MongoDB
        ↓
emit('new-message') to Room
        ↓
All Users in Room Receive Update
        ↓
Update Component State
        ↓
UI Renders New Message
```

### User Presence
```
User Opens App
        ↓
WebSocket Connection Established
        ↓
emit('user-join', {username, avatar})
        ↓
Server Broadcasts 'users-list'
        ↓
All Connected Users Receive List
        ↓
Update UserList Component
        ↓
UI Shows Online Users
```

---

## 🎨 Responsive Design Architecture

### Breakpoints & Layouts

#### Desktop (1024px+)
```
┌────────────────────────────────────────────────────┐
│               Navigation Header                     │
├─────────┬──────────────┬──────────────────────────┤
│ Users   │ Rooms        │ Chat                     │
│ (25%)   │ (30%)        │ (45%)                    │
│         │              │                          │
│         │              │  [Messages]              │
│         │              │  [Typing]                │
│         │              │  [Input Form]            │
├─────────┴──────────────┴──────────────────────────┤
└────────────────────────────────────────────────────┘
```

#### Tablet (768px - 1023px)
```
┌───────────────────────────────────────────┐
│      Navigation / User Profile            │
├──────┬───────────┬──────────────────────┤
│Users │Rooms      │Chat                  │
│(25%) │(35%)      │(40%)                 │
├──────┴───────────┴──────────────────────┤
└───────────────────────────────────────────┘
```

#### Mobile (<768px)
```
┌────────────────────────────┐
│    Users (Horizontal)      │
├────────────────────────────┤
│    Rooms (Horizontal)      │
├────────────────────────────┤
│                            │
│    Chat (Full Width)       │
│                            │
│    [Messages]              │
│    [Typing]                │
│    [Input Form]            │
└────────────────────────────┘
```

---

## 🔐 Security Architecture

```
Frontend (Client)
├── Input Validation
├── Error Handling
├── Session Management (localStorage)
└── HTTPS Communication

    ↓ HTTPS ↓

Backend (Server)
├── CORS Configuration
├── Input Validation
├── Authentication Middleware
├── Error Handling
└── Environment Secrets

    ↓ Encrypted ↓

Database (MongoDB)
├── Connection Authentication
├── Data Encryption
├── Access Control
└── Backup System
```

---

## 📊 Message Processing Pipeline

```
Frontend:                Backend:              Database:
┌──────────────┐        ┌──────────────┐      ┌──────────────┐
│ Input Form   │        │ Validation   │      │ Save Message │
│ User Types   │───────→│ Database     │─────→│ Create Index │
│ Hits Send    │ Socket │ Save Record  │      │ Notify Room  │
└──────────────┘        └──────────────┘      └──────────────┘
        ↑                       │                      │
        │                       │                      │
        └───────────────────────┴──────────────────────┘
                   Broadcast to Room
```

---

## 🔄 Authentication Flow

```
User Registration
    ↓
Validate Input
    ↓
Save to Database
    ↓
Return User Data
    ↓
Store in localStorage
    ↓
Redirect to Chat
    ↓
    
User Login
    ↓
Validate Credentials
    ↓
Find in Database
    ↓
Return User Data
    ↓
Store in localStorage
    ↓
Connect Socket
    ↓
Redirect to Chat
    ↓
    
User Logout
    ↓
Clear localStorage
    ↓
Disconnect Socket
    ↓
Redirect to Login
```

---

## 🚀 Performance Optimization Points

```
Frontend:
├── Component Lazy Loading
├── Message Pagination
├── CSS Minification
├── Asset Compression
└── Socket Connection Pooling

Backend:
├── Database Indexing
├── Connection Pooling
├── Response Compression
├── Caching Strategies
└── Load Balancing

Database:
├── Index Optimization
├── Query Optimization
├── Connection Pooling
├── Replication Setup
└── Backup Strategy
```

---

## 📦 Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│           CDN / Load Balancer                   │
└─────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│  Reverse Proxy (Nginx/Apache)        │
├──────────────┬───────────────────────┤
│ Frontend     │ Backend               │
│ (Static)     │ (Node.js)             │
└──────────────┴───────────────────────┘
         ↓              ↓
┌──────────────┐  ┌──────────────┐
│ S3/Cloudflare│  │ Server Pool  │
│ (Assets)     │  │ - Node 1     │
└──────────────┘  │ - Node 2     │
                  │ - Node N     │
                  └──────────────┘
                         ↓
                  ┌──────────────┐
                  │  MongoDB     │
                  │  Replica Set │
                  └──────────────┘
```

---

## 🎯 Key Design Patterns Used

### Frontend
1. **Container/Presentational Pattern** - App manages state, components render
2. **Service Locator Pattern** - api.js and socket.js centralize calls
3. **Observer Pattern** - Socket listeners update components
4. **Singleton Pattern** - Socket.io single connection instance

### Backend
1. **MVC Pattern** - Controllers (routes), Models (schemas), Views (API responses)
2. **Middleware Pattern** - CORS, JSON parsing middleware
3. **Observer Pattern** - Socket.io event emitters
4. **Factory Pattern** - Model instances creation

---

## 📈 Scalability Considerations

```
Current Single Server:
┌─────────────────────┐
│   Load Balancer     │
├─────────────────────┤
│   Node.js Server    │
│   Socket.io         │
│   MongoDB           │
└─────────────────────┘

Scalable Multi-Server:
┌─────────────────────┐
│   Load Balancer     │
├─────────────────────┤
│   Server 1 ─┐
│   Server 2  ├─ Socket.io Adapter
│   Server 3 ─┘
└─────────────────────┘
        ↓
    ┌────────────┐
    │  MongoDB   │
    │ Replica Set│
    └────────────┘
        ↓
    ┌────────────┐
    │   Redis    │
    │   Cache    │
    └────────────┘
```

---

## 🔍 Monitoring Points

```
Frontend:
├── Error Tracking (Sentry)
├── Performance Monitoring
├── User Analytics
└── Network Requests

Backend:
├── Request Logging
├── Error Logging
├── Database Query Performance
├── Socket.io Events
└── Server Health

Database:
├── Connection Pool Usage
├── Query Performance
├── Storage Usage
├── Replication Status
└── Backup Status
```

---

This architecture provides:
✅ **Scalability** - Easy to add more servers  
✅ **Reliability** - Database replication, backup  
✅ **Performance** - Optimized queries, caching  
✅ **Security** - CORS, validation, encryption  
✅ **Maintainability** - Clear separation of concerns  

---
