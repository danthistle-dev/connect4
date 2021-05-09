class Game {
  constructor(){
    this.width = 7;
    this.height = 6;
    this.numTurns = 0;
  }

  // Static function that creates an empty board object.
  static initBoard () {
    var board = {};
    for (var x = 0; x < 7; x++) {
      board[x] = {};
      for (var y = 0; y < 6; y++) {
        board[x][y] = 'free';
      }
    }
    return board;
  }

  // Updates the board with a valid move. Also checks for win or tie.
  markNextFree (x, board, colour) {
    var nextY = false;

    for (var y = 0; y < 7; y++) {
      if (board[x][y] === 'free') {
        nextY = y;
        break;
      }
    }

    if (nextY === false) {
      console.log('No free spaces in this column, try another.');
      return false;
    }

    board[x][nextY] = colour;
    
    if (this.isWinner(parseInt(x), nextY, board, colour)) {
      return true;
    }
    
    this.numTurns += 1;
    
    if(this.numTurns >= this.height * this.width) {
      return ('Tie');				
    }
    return board;
  }

  isWinner (currentX, currentY, board, colour) {
    return this.checkDirection(board, colour, currentX, currentY, 'vertical') ||
           this.checkDirection(board, colour, currentX, currentY, 'diagonal') ||
           this.checkDirection(board, colour, currentX, currentY, 'horizontal');
  }

  isBounds (board, x, y) {
    return (board.hasOwnProperty(x) && typeof board[x][y] !== 'undefined');
  }

  checkDirection (board, colour, currentX, currentY, direction) {
    var chainLength, directions;

    directions = {
      horizontal: [
        [0, -1], [0, 1]
      ],
      vertical: [
        [-1, 0], [1, 0]
      ],
      diagonal: [
        [-1, -1], [1, 1], [-1, 1], [1, -1]
      ]
    };

    chainLength = 1;

    directions[direction].forEach(coords => {
      var i = 1;
      while (this.isBounds(board, currentX + (coords[0] * i), currentY + (coords[1] * i)) &&
             board[currentX + (coords[0] * i)][currentY + (coords[1] * i)] === colour) {
               chainLength++;
               i++
             }
    })

    return (chainLength >= 4)

  }

}

export default Game;