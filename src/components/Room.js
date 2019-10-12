import React from 'react';
import openSocket from 'socket.io-client';

import Chat from './Chat';
import Board from './Board';
import Game from '../game';

class Room extends React.Component {

  state = {
    board: Game.initBoard(), 
    socket: openSocket('localhost:4000'), 
    messages: [],
    turn: true
  }

  componentWillMount = () => {
    const { params: { gameId } } = this.props.match;
    this.setState({ gameId });
  }

  componentDidMount = () => {    
    this.getBoardState();
    this.state.socket.on('init', msg => this.setState({ messages: msg }));
    this.state.socket.on('chat message', msg => this.setState({ messages: msg }));
  }

  componentWillUnmount = () => {
    this.state.socket.close();
  }

  sendMove = (col) => {
    if (this.state.turn) {
      this.state.socket.emit('make move', { col: col, gameId: this.state.gameId });
      this.setState({turn: false});
    }
    this.state.socket.on('make move', nextBoard => this.setState({ board: nextBoard, turn: true }));
  }

  getBoardState = () => {
    this.state.socket.emit('get board', { gameId: this.state.gameId });
    this.state.socket.on('get board', board => this.setState({ board }));
  };

  render() {
    return(
      <div className="ui container" style={{ marginTop: '50px' }}>
        <div className="ui header">Room code: {this.state.gameId}</div>
        <div className="ui grid">       
          <Board 
            board={this.state.board} 
            sendMove={this.sendMove} 
            getBoardState={this.getBoardState} 
            turn={this.turn}
          />          
          <div className="five wide column" style={{ border: '1px solid green', height: '80vh', backgroundColor: 'darkgrey' }}>
            <Chat 
              name={this.props.name || 'Gamer'} 
              socket={this.state.socket}
              messages={this.state.messages}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Room;