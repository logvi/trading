const http = require('http');
const io = require('socket.io')();
const startApi = require('./api');
const jwt = require('jsonwebtoken');
const config = require('./config');

const server = http.createServer((req, res) => {}).listen(3000, () => {
  console.log('server is running on 3000');
});

io.attach(server);

io.use((socket, next) => {
  const handshakeData = socket.handshake;
  if (handshakeData.query.token) {
    jwt.verify(handshakeData.query.token, config.JWT_SECRET, function(err, decoded) {
      if(err) return next(new Error('Authentication error'));
      socket.token = decoded;
      next();
    });
    return;
  }
  next();
});

io.on('connection', socket => {
  console.log('user connected', socket.token);

  startApi(socket);
});