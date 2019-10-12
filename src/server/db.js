const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;

const url = 'mongodb://localhost:27017';

const dbName = 'cosc360_dthistle';

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

exports.createGame = function (req, res) {
  client.connect(function(err) {
    assert.equal(null, err);
    console.log('Connected successfully to server');
  
    const db = client.db(dbName);
    const game = req.body;
    db.collection('games').insertOne(game, function() {
      console.log('Created game:');
      console.log(game);
      res.send(game._id);
      client.close();
    });  
  });
};

exports.saveBoard = function (board, gameId) {
  client.connect(function(err) {
    assert.equal(null, err);
    const db = client.db(dbName);
    const id = new ObjectID(gameId);
    db.collection('games').updateOne(
      { _id: id }, 
      {
        $set: { board }
      },
      function(err, result) {
        console.log('Updated game:');
        console.log(gameId);
        client.close();
      }
    );  
  })
};

exports.getBoard = function (gameId) {
  return new Promise(function(resolve, reject) {
    client.connect(function(err) {
      assert.equal(null, err);
      const db = client.db(dbName);
      const id = new ObjectID(gameId);
      db.collection('games').find({_id: id }).toArray((err, board) => {
        resolve(board[0].board);
      });
      client.close();
    });
  });
};