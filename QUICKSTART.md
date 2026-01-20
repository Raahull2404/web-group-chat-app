# Quick Start Guide

Get up and running with the Web Group Chat App in 5 minutes!

## Prerequisites

- Node.js v14+ installed
- MongoDB running locally or MongoDB Atlas account
- Git installed

## Installation & Setup

### 1. Clone or Navigate to Project

```bash
cd web-group-chat-app
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/chat-app
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-key
CORS_ORIGIN=http://localhost:3000
```

### 4. Start MongoDB

**Windows:**
```bash
mongod
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

Or use **MongoDB Atlas** (Cloud):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 5. Start Backend Server

```bash
npm run dev
```

You should see:
```
MongoDB connected
Server running on port 5000
```

### 6. Install Frontend Dependencies

In a new terminal:
```bash
cd client
npm install
```

### 7. Start Frontend Server

```bash
npm start
```

React will open automatically at `http://localhost:3000`

## First Use

1. **Register** - Create a new account
   - Username: anything
   - Email: any email
   - Password: any password

2. **Login** - Sign in with your credentials

3. **Create Room** - Click "New Room" button
   - Name: "My First Room"
   - Description: "Testing the app"

4. **Join Room** - Click "Join" on a room

5. **Chat** - Type a message and send!

## Folder Structure

```
.
├── server.js           ← Backend server
├── package.json        ← Backend dependencies
├── .env               ← Environment config
└── client/
    ├── src/
    │   ├── App.js     ← Main app
    │   ├── components/ ← React components
    │   ├── services/  ← API & Socket services
    │   └── styles/    ← CSS files
    └── package.json   ← Frontend dependencies
```

## Common Issues & Solutions

### Port 5000 Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error
- Check MongoDB is running: `mongo`
- Or update `MONGODB_URI` to use MongoDB Atlas

### React Won't Start
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm start
```

### Can't Login
- Make sure backend is running on port 5000
- Check browser console for errors
- Clear browser cache and cookies

## Testing the App

1. Open two browser windows
2. Login with different accounts in each
3. Create a room in one window
4. Join the same room in other window
5. Send messages back and forth
6. See real-time updates!

## Next Steps

1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
2. Read [FEATURES.md](FEATURES.md) for all features
3. Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
4. Check [DEPLOYMENT.md](DEPLOYMENT.md) to deploy online

## Key Files

- **Backend Logic**: `server.js`
- **API Endpoints**: Lines 94-152 in `server.js`
- **Socket Events**: Lines 53-92 in `server.js`
- **Frontend Router**: `client/src/App.js`
- **Chat Component**: `client/src/components/ChatRoom.js`
- **Styles**: `client/src/styles/`

## Useful Commands

```bash
# Backend
npm run dev          # Start with auto-reload
npm start           # Start production
npm run server      # Alternative start

# Frontend
cd client && npm start     # Start React dev server
cd client && npm run build # Build for production
cd client && npm test      # Run tests

# Database
mongodump --uri="..." --out ./backup    # Backup
mongorestore --uri="..." ./backup       # Restore
```

## Quick Customization

### Change Port
Edit `.env`:
```
PORT=3001
```

### Change App Title
Edit `client/public/index.html`:
```html
<title>My Chat App</title>
```

### Change Colors
Edit `client/src/styles/app.css`:
```css
background: linear-gradient(135deg, #YOUR_COLOR1, #YOUR_COLOR2);
```

### Change API URL
Edit `client/src/services/api.js`:
```javascript
const API_URL = 'http://your-api-url/api';
```

## Performance Tips

1. Use Chrome DevTools to monitor performance
2. Check "Preserve log" in Network tab
3. Use Redux DevTools for state debugging
4. Monitor WebSocket in Network → WS tab
5. Check Console for any errors

## Getting Help

1. Check error messages in browser console
2. Check server logs in terminal
3. Check MongoDB connection with `mongo`
4. Review [README.md](README.md)
5. Check [FEATURES.md](FEATURES.md)

## Deployment

When ready to go live:
1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Set up MongoDB Atlas (free)
3. Deploy backend to Heroku, Railway, or AWS
4. Deploy frontend to Vercel or Netlify
5. Configure environment variables
6. Test all features

## What's Next?

### Add Features:
- Message reactions (emoji)
- User profiles
- File sharing
- Voice calling
- Dark theme

### Improve Performance:
- Implement message pagination
- Add Redis caching
- Optimize bundle size
- Enable compression

### Enhance Security:
- Add JWT authentication
- Implement rate limiting
- Add input validation
- Enable HTTPS

## Project Status

✅ Core functionality complete
✅ Real-time messaging working
✅ Mobile responsive
✅ Ready for enhancement

## License

ISC

---

**Happy Coding!** 🎉

Questions? Check the documentation files or review the code comments.
