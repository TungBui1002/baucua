const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let balance = 1000;

const keys = ["bau", "cua", "tom", "ca", "nai", "ga"];

function calculateResult(results, bets) {
  let winnings = 0;

  results.forEach(result => {
    if (bets[result]) {
      winnings += bets[result];
    }
  });

  return winnings;
}

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.emit('balanceUpdate', balance);

  socket.on('placeBet', (bets) => {
    const results = [];
    for (let i = 0; i < 3; i++) {
      const randKey = keys[Math.floor(Math.random() * keys.length)];
      results.push(randKey);
    }

    const winnings = calculateResult(results, bets);
    const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);
    const newBalance = balance + winnings - totalBet;

    balance = newBalance;

    io.emit('gameResult', { results, winnings, newBalance });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});