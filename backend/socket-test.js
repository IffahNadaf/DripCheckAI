const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to DripCheck Socket.IO:', socket.id);

  socket.emit('join_conversation', 1);

  console.log('Joined conversation 1. Waiting for messages...');
});

socket.on('new_message', (message) => {
  console.log('\n⚡ REAL-TIME MESSAGE RECEIVED:');
  console.log(message);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error.message);
});