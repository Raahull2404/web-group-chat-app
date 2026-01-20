# Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] CORS properly configured
- [ ] Dependencies updated
- [ ] Code reviewed and tested
- [ ] Security audit completed

## Production Environment Setup

### Environment Variables (.env)

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app
PORT=5000
JWT_SECRET=your-production-secret-key
CORS_ORIGIN=https://yourdomain.com
API_URL=https://api.yourdomain.com
```

## Deployment Options

### Option 1: Heroku Deployment

#### Backend Deployment

```bash
# 1. Create Heroku account and install Heroku CLI
npm install -g heroku
heroku login

# 2. Create Heroku app
heroku create your-chat-app-backend

# 3. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your-mongodb-uri>
heroku config:set JWT_SECRET=<your-secret>
heroku config:set CORS_ORIGIN=https://your-frontend-url.com

# 4. Deploy
git push heroku main

# 5. View logs
heroku logs --tail
```

#### Frontend Deployment (Vercel)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to client directory
cd client

# 3. Deploy
vercel

# 4. Configure environment variables in Vercel dashboard
# REACT_APP_API_URL=https://your-backend-api.com
```

### Option 2: Docker Deployment

#### Backend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Build and Run Docker

```bash
# Build image
docker build -t chat-app-backend .

# Run container
docker run -p 5000:5000 --env-file .env chat-app-backend

# Push to Docker Hub
docker tag chat-app-backend username/chat-app-backend
docker push username/chat-app-backend
```

### Option 3: AWS Deployment

#### EC2 Setup

```bash
# 1. Launch EC2 instance (Ubuntu 20.04)
# 2. Connect via SSH

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install MongoDB
sudo apt-get install -y mongodb

# 5. Clone repository
git clone https://github.com/your-username/web-group-chat-app.git
cd web-group-chat-app

# 6. Install dependencies
npm install
cd client && npm install && cd ..

# 7. Configure environment
cp .env.example .env
nano .env  # Edit with your settings

# 8. Build frontend
cd client && npm run build && cd ..

# 9. Install PM2 for process management
sudo npm install -g pm2

# 10. Start application
pm2 start server.js --name "chat-app"
pm2 save
pm2 startup

# 11. Configure Nginx
sudo apt-get install -y nginx
# Configure nginx.conf to proxy to Node.js
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        root /home/ubuntu/web-group-chat-app/client/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:5000/socket.io;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Option 4: DigitalOcean App Platform

```bash
# 1. Create account on DigitalOcean
# 2. Connect GitHub repository
# 3. Configure environment variables
# 4. Deploy button deploys automatically

# Backend Configuration
Name: chat-app-backend
Source: GitHub
Build Command: npm install
Run Command: npm start
Environment:
  - NODE_ENV=production
  - MONGODB_URI=<your-uri>
  - PORT=5000
```

### Option 5: Firebase/Google Cloud

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize project
firebase init

# 4. Deploy
firebase deploy

# Backend can run on Cloud Functions or Cloud Run
gcloud run deploy chat-app-backend \
  --source . \
  --platform managed \
  --region us-central1
```

## Database Deployment

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Create database user
5. Get connection string
6. Add IP whitelist
7. Add connection string to `.env`

### Database Backup

```bash
# Backup MongoDB
mongodump --uri="mongodb+srv://user:password@cluster.mongodb.net" --out ./backup

# Restore MongoDB
mongorestore --uri="mongodb+srv://user:password@cluster.mongodb.net" ./backup
```

## SSL/TLS Certificate Setup

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renew
sudo certbot renew --dry-run
```

## Performance Optimization

### Frontend Optimization

```bash
# Build optimized production bundle
cd client
npm run build

# Check bundle size
npm install -g source-map-explorer
source-map-explorer 'build/static/js/*.js'
```

### Backend Optimization

1. **Enable Compression**
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Connection Pooling**
```javascript
mongoose.set('maxPoolSize', 10);
```

3. **Caching Headers**
```javascript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

## Monitoring and Logging

### Frontend Monitoring

```javascript
// Add error tracking
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

### Backend Monitoring

```javascript
// Add Winston logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### PM2 Monitoring

```bash
# Install PM2 Plus
pm2 plus

# Monitor application
pm2 monit
```

## Auto-scaling Setup

### AWS Auto Scaling

```bash
# Create launch template
aws ec2 create-launch-template \
  --launch-template-name chat-app-template \
  --version-description "Production template"

# Create auto scaling group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name chat-app-asg \
  --launch-template LaunchTemplateName=chat-app-template
```

### Load Balancing

```bash
# Create load balancer
aws elbv2 create-load-balancer \
  --name chat-app-lb \
  --subnets subnet-12345 subnet-67890
```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

## Post-Deployment

### Health Check

```bash
# Test backend
curl https://api.yourdomain.com/api/rooms

# Test Socket.io
wscat -c wss://api.yourdomain.com/socket.io

# Check database
mongo "mongodb+srv://user:password@cluster.mongodb.net"
```

### Monitoring Setup

1. Set up error tracking (Sentry)
2. Configure logging (Loggly, Papertrail)
3. Set up uptime monitoring (UptimeRobot)
4. Configure alerts (PagerDuty)
5. Monitor performance (New Relic, DataDog)

### Backup Strategy

1. Daily database backups
2. Weekly code repository backups
3. Version control with Git
4. Database replication
5. Disaster recovery plan

## Scaling Strategies

### Horizontal Scaling
- Multiple server instances
- Load balancer distribution
- Database replication
- Cache layers (Redis)

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching
- CDN for static assets

## Cost Optimization

1. Use free tier services
2. Set up budget alerts
3. Use spot instances
4. Optimize database storage
5. Enable CDN caching

## Troubleshooting

### Connection Issues
```bash
# Check server status
curl -I https://api.yourdomain.com

# Check logs
pm2 logs chat-app
```

### Database Issues
```bash
# Check connection
mongo "mongodb+srv://user:password@cluster.mongodb.net"

# Check indexes
db.messages.getIndexes()
```

### Socket Issues
```javascript
// Enable debugging
io.set('log level', 3);
io.enable('browser client minification');
```

## Rollback Procedure

```bash
# Revert to previous version
git revert <commit-hash>
git push heroku main

# Restore database backup
mongorestore --uri="mongodb+srv://..." ./backup
```

## Security Hardening

- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Enable database authentication
- [ ] Use environment variables
- [ ] Regular security updates
- [ ] Rate limiting enabled
- [ ] Input validation enabled
- [ ] Logging configured
