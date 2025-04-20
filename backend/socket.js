const { Server } = require('socket.io');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinOrderRoom', (orderId) => {
      socket.join(orderId);
      console.log(\`Client \${socket.id} joined room \${orderId}\`);
    });

    socket.on('leaveOrderRoom', (orderId) => {
      socket.leave(orderId);
      console.log(\`Client \${socket.id} left room \${orderId}\`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

function emitOrderStatusUpdate(orderId, status) {
  if (io) {
    io.to(orderId).emit('orderStatusUpdate', { orderId, status });
  }
}

module.exports = { initSocket, emitOrderStatusUpdate };
