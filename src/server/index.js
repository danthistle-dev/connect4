const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const Game = require('../game');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var connections = [];

var db = require('./db');

app.post('/api/creategame', db.createGame);

app.get('/', function(req, res){
  res.send('connected...');
});

// Socket.io
const io = require('socket.io').listen(server);
var messages = [];
const game = new Game();
var board = Game.initBoard();
var gameId = null;
var players = ['yellow', 'red'];
var currentPlayer = 'red';

io.sockets.on('connection', function(socket){

  // Retrieves current board from the database, emits it to all sockets.
  socket.on('get board', async data => {
    board = await db.getBoard(data);
    io.emit('get board', board);
    gameId = data;  
  });

  // Saves game to database every 20 seconds.
  setInterval(() => {
    db.saveBoard(board, gameId);
  }, 20000);

  // Sends initial messeges array to all sockets.
  io.emit('init', messages);

  // Assigns colours to players.
  if (players && players.length) {
    io.to(socket.id).emit('player colour', players.pop());
  } else {
    io.to(socket.id).emit('player colour', 'Spectator');
  }

  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);
  
  // Re-adds colours to playeres array when a socket disconnects.
  socket.on('disconnect', function(data){
    if (players.length === 1) {
      players.push('red');
    } else if (players.length === 0) {
      players.push('yellow');
    }
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  })
  
  // Makes move on the board and checks for win.
  socket.on('make move', function(data){
    if (data.player === currentPlayer) {
      var newBoard = game.markNextFree(data.col, board, data.player);
      if (newBoard === true) {
        io.emit('check win', data.player);
        board = Game.initBoard();
      } else if (newBoard === 'Tie') {
        io.emit('check win', 'Tie');
        board = Game.initBoard();
      } else {
        board = newBoard;
      }
      currentPlayer === 'red' ? currentPlayer = 'yellow' : currentPlayer = 'red';
    }  
    io.emit('make move', board);
    io.emit('current player', currentPlayer);   
  });

  // Sends board to all sockets on request.
  socket.on('get board', function(data) {
    io.emit('get board', board);
  })

  // Sends message array to all sockets when a new message is received.
  socket.on('chat message', function(data){
    messages.push(data);
    io.emit('chat message', messages);
    console.log(messages);
  })
  
})

server.listen(4000);