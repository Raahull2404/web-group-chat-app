# Environment Configuration Guide

## Development Environment

Create a `.env` file in the root directory with these variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/chat-app

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your-development-secret-key-change-in-production

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
API_URL=http://localhost:5000

# Socket.io Configuration
SOCKET_URL=http://localhost:5000
```

## Production Environment

For production deployment:

```env
# Database Configuration (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=production

# Security (Generate a strong random key)
JWT_SECRET=generate-long-random-string-here-min-32-characters

# CORS Configuration (Update with your domain)
CORS_ORIGIN=https://yourdomain.com
API_URL=https://api.yourdomain.com

# Socket.io Configuration
SOCKET_URL=https://api.yourdomain.com
```

## Environment Variables Explanation

### Database Configuration

**MONGODB_URI**
- Local: `mongodb://localhost:27017/chat-app`
- MongoDB Atlas: `mongodb+srv://user:password@cluster.mongodb.net/db-name`

To get MongoDB Atlas connection string:
1. Go to MongoDB Atlas Dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<username>` and `<password>`
6. Add database name after `/`

### Server Configuration

**PORT**
- Development: 5000
- Production: 80 (HTTP) or 443 (HTTPS)
- Can be any available port

**NODE_ENV**
- `development` - for local development
- `production` - for deployed applications

### Security

**JWT_SECRET**
- Used for signing authentication tokens
- Must be a long, random string (32+ characters)
- Change for production!

Generate a secure secret:
```bash
# macOS/Linux
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random 10000000000000000)))
```

### CORS Configuration

**CORS_ORIGIN**
- Development: `http://localhost:3000` (React dev server)
- Production: `https://yourdomain.com` (your domain)

This controls which domains can access your API.

**API_URL**
- Development: `http://localhost:5000`
- Production: `https://api.yourdomain.com`

This is the URL where your backend runs.

### Socket.io Configuration

**SOCKET_URL**
- Development: `http://localhost:5000`
- Production: `https://api.yourdomain.com`

This is used by the frontend to connect to WebSocket.

## Frontend Environment Variables

In `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

For production:
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_SOCKET_URL=https://api.yourdomain.com
```

## MongoDB Connection Strings

### Local MongoDB
```
mongodb://localhost:27017/chat-app
```

### MongoDB Atlas (Cloud)
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/chat-app?retryWrites=true&w=majority
```

### MongoDB with Authentication
```
mongodb://username:password@localhost:27017/chat-app
```

### MongoDB with Replica Set
```
mongodb://server1:27017,server2:27017,server3:27017/chat-app?replicaSet=rs0
```

## Using Environment Variables in Code

### Backend (Node.js)

```javascript
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true
};
```

### Frontend (React)

```javascript
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
```

## Environment Setup by Platform

### Heroku

Set environment variables via CLI:
```bash
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-app.herokuapp.com
```

Or use Heroku Dashboard:
1. Go to app settings
2. Click "Reveal Config Vars"
3. Add each variable

### AWS

Use AWS Systems Manager Parameter Store:
```bash
aws ssm put-parameter \
  --name /chatapp/mongodb_uri \
  --value "mongodb+srv://..." \
  --type "SecureString"
```

### DigitalOcean App Platform

In app.yaml:
```yaml
env:
  - key: MONGODB_URI
    scope: RUN_AND_BUILD_TIME
    value: ${db.DATABASE_URL}
  - key: JWT_SECRET
    scope: RUN_AND_BUILD_TIME
    value: ${JWT_SECRET}
```

### Docker

In docker-compose.yml:
```yaml
services:
  backend:
    environment:
      - MONGODB_URI=mongodb://mongo:27017/chat-app
      - PORT=5000
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - CORS_ORIGIN=http://localhost:3000
```

### Vercel (Frontend)

In vercel.json:
```json
{
  "env": {
    "REACT_APP_API_URL": "@api_url",
    "REACT_APP_SOCKET_URL": "@socket_url"
  }
}
```

## Security Best Practices

1. **Never commit .env file**
   - Add to .gitignore ✓
   - Keep secrets out of version control

2. **Use strong secrets**
   - JWT_SECRET: minimum 32 characters
   - Random and unique
   - Different for each environment

3. **Environment-specific configs**
   - Separate .env files per environment
   - .env.local for local development
   - .env.production for production

4. **Access control**
   - Limit who can see environment variables
   - Use secrets management tools
   - Rotate secrets regularly

5. **CORS configuration**
   - Only allow trusted origins
   - Use specific domains, not wildcards
   - Review CORS headers

## Common Issues

### "Cannot find module dotenv"
```bash
npm install dotenv
```

### Environment variables not loading
- Check .env file location (root directory)
- Ensure variables are exported
- Restart server after changes

### CORS error
- Check CORS_ORIGIN matches frontend URL
- Check frontend API_URL is correct
- Verify both running on correct ports

### MongoDB connection failed
- Check MongoDB is running
- Verify connection string
- Check username/password
- Check IP whitelist (Atlas)

## Verification

Test your environment:

```bash
# Backend
echo $PORT
echo $MONGODB_URI
echo $NODE_ENV

# Frontend  
echo $REACT_APP_API_URL
echo $REACT_APP_SOCKET_URL
```

## Checklist

- [ ] Created .env file
- [ ] Set MONGODB_URI
- [ ] Set JWT_SECRET (production use strong key)
- [ ] Set PORT
- [ ] Set NODE_ENV
- [ ] Set CORS_ORIGIN
- [ ] Set API_URL
- [ ] Added .env to .gitignore
- [ ] Tested connection
- [ ] Verified all variables loaded

---

For more information, see:
- [SETUP_GUIDE.md](SETUP_GUIDE.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [README.md](README.md)
