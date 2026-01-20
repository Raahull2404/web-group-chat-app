// Socket.io Configuration
// Place this in the server.js file or separate config file

const socketConfig = {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5000', 'https://yourdomain.com'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  maxHttpBufferSize: 1e6,
  pingInterval: 25000,
  pingTimeout: 60000
};

module.exports = socketConfig;
