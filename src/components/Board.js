import React from 'react';
import '../style.css';

class Board extends React.Component {

  // Renders initial board and attaches event listeners to the columns.
  componentDidMount() {
    this.createBoard(this.props.board);
    this.createEventListeners();
  }

  // Rerenders the board when the board changes.
  componentDidUpdate() {
    this.createBoard(this.props.board);
    this.createEventListeners();
  }

  // Creates elements and svg's that represent the board.
  createBoard(board) {  
    const width = 7;
    const height = 6;
    const cellSize = 100;
    const xmlns = 'http://www.w3.org/2000/svg';
    const boardDiv = document.querySelector('#board');

    boardDiv.innerHTML = '';

    for (let y = 0; y < width; y++) {
      let col = document.createElement('div');
      col.classList.add('game-col');
      col.setAttribute('id', `column-${y}`);
      col.setAttribute('data-x', `${y}`);
      boardDiv.append(col);

      for (let x = height-1; x > -1; x--) {
        let svg = document.createElementNS(xmlns, 'svg');
        svg.setAttribute('width', cellSize);
        svg.setAttribute('height', cellSize);
        svg.classList.add(`row-${x}`);

        let circle = document.createElementNS(xmlns, 'circle');
        circle.setAttribute('cx', '50');
        circle.setAttribute('cy', '50');
        circle.setAttribute('r', '40');
        circle.setAttribute('stroke', '#0B4E72');
        circle.setAttribute('stroke-width', '3');
        circle.classList.add(board[y][x]);

        svg.append(circle);
        col.append(svg);  
      }
    }    
  }

  // Attaches event listeners to the columns. Columns run sendMove() when clicked.
  createEventListeners = () => {
    var columns = document.querySelectorAll('.game-col');

    Array.prototype.forEach.call(columns, col => {
      col.addEventListener('click', () => {
        this.props.sendMove(col.getAttribute('data-x'));
      });
    });
  }

  render() {
    return <div id="board"></div>
  }
}

export default Board;