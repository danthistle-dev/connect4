class Game {
  constructor(){
    this.width = 7;
    this.height = 6;
    this.numTurns = 0;
  }

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

    return board;

  }

  /* 
    if (this.isWinner(parseInt(x), nextY)) {
      console.log(`${colour} wins!`);
      this.clearBoard();
      return true;
    }

    this.numTurns += 1;

    if(this.numTurns >= this.height * this.width) {
      console.log('It\'s a tie!');
      this.clearBoard();
      return true;				
    }
  */

  clearBoard() {
    Array.prototype.forEach.call(document.querySelectorAll('circle'), function(piece) {
      piece.setAttribute('class', 'free');
    });

    this.gameBoard = {};

    for(var x = 0; x <= this.height; x++) {			
      this.gameBoard[x] = {};    
      for(var y = 0; y <= this.width; y++) {
        this.gameBoard[x][y] = 'free';
      }
    }

    this.numTurns = 0;
			
		return this.gameBoard;
  }

  isWinner (currentX, currentY) {
    return this.checkDirection(currentX, currentY, 'vertical') ||
           this.checkDirection(currentX, currentY, 'diagonal') ||
           this.checkDirection(currentX, currentY, 'horizontal');
  }

  isBounds (x, y) {
    return (this.gameBoard.hasOwnProperty(x) && typeof this.gameBoard[x][y] !== 'undefined');
  }

  checkDirection (currentX, currentY, direction) {
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
      while (this.isBounds(currentX + (coords[0] * i), currentY + (coords[1] * i)) &&
             this.gameBoard[currentX + (coords[0] * i)][currentY + (coords[1] * i)] === this.currentPlayer) {
               chainLength++;
               i++
             }
    })

    return (chainLength >= 4)

  }

}

module.exports = Game;