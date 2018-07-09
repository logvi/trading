const http = require('http');
const io = require('socket.io')();
const startApi = require('./api');

const server = http.createServer((req, res) => {}).listen(3000, () => {
  console.log('server is running on 3000');
});

io.attach(server);

io.on('connection', socket => {
  console.log('user connected');

  startApi(socket);
});