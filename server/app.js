require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const socketController = require('./socket');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

// Define your routes and middleware here
app.get("/users", (req, res) => {})

// Socket.io event handlers
io.on('connection',  (socket) => socketController(socket, io));

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});