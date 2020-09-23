const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3020;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("get data", () => {
      io.emit("heres data", "hi");
  })
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});