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
var messages = [];
const game = new Game();
var currentColour = 'red';

var db = require('./db');

app.post('/api/creategame', db.createGame);

app.get('/', function(req, res){
  res.send('connected...');
})

// Socket.io
const io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
  io.emit('init', messages);
  io.to(socket.id).emit('player colour', );
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);
  
  socket.on('disconnect', function(data){
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  })
  
  socket.on('make move', async function(data){
    var board = await db.getBoard(data.gameId);   
    var newBoard = game.markNextFree(data.col, board, currentColour);
    db.makeMove(newBoard, data.gameId);
    var nextBoard = await db.getBoard(data.gameId);
    io.emit('make move', nextBoard);     
    if (currentColour === 'red') currentColour = 'yellow'; 
      else currentColour = 'red';
  });

  socket.on('get board', async function(data) {
    console.log(data.gameId);
    var board = await db.getBoard(data.gameId);
    io.emit('get board', board);
  })

  socket.on('chat message', function(data){
    messages.push(data);
    io.emit('chat message', messages);
    console.log(messages);
  })
  
})

server.listen(4000);