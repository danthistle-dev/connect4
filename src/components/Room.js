import React from 'react';
import openSocket from 'socket.io-client';
import { Modal } from 'semantic-ui-react';

import Chat from './Chat';
import Board from './Board';
import Game from '../game';

class Room extends React.Component {

  state = {
    board: Game.initBoard(), 
    socket: openSocket('localhost:4000'), 
    messages: [],
    currentPlayer: 'red',
    open: false,
    win: ''
  }

  // Sets the route to the unique game id
  componentWillMount = () => {
    const { params: { gameId } } = this.props.match;
    this.setState({ gameId });
  }

  // Initiates the game board and messeges, assigns player colour.
  componentDidMount = () => {    
    this.getBoardState();
    this.state.socket.on('player colour', player => this.setState({ player }))
    this.state.socket.on('init', msg => this.setState({ messages: msg }));
    this.state.socket.on('chat message', msg => this.setState({ messages: msg }));
  }

  // Closes socket 
  componentWillUnmount = () => {
    this.state.socket.close();
  }

  // Sends move to the server along with the player who made it.
  sendMove = col => {
    if (this.state.player === 'red' || this.state.player === 'yellow') {
      this.state.socket.emit('make move', { col, player: this.state.player });
    }
    this.state.socket.on('make move', nextBoard => this.setState({ board: nextBoard }));
    this.state.socket.on('current player', currentPlayer => this.setState({ currentPlayer }));
    this.state.socket.on('check win', win => {
      this.setState({ win, open: true });
    });
  }

  // Sends game id to the server and receives the current board in return.
  getBoardState = () => {
    this.state.socket.emit('get board', this.state.gameId );
    this.state.socket.on('get board', board => this.setState({ board }));
  };

  // Reads in and performs chat commands.
  chatCommands = cmd => {
    var arr = cmd.split(' ');
    if (arr[0] === '/setname') {
      this.props.setName(arr[1]);
    } else if (arr[0] === '/setplayer') {
      if (arr[1] === 'red' || arr[1] === 'yellow') {
        this.setState({ player: arr[1] })
      }
    } else if (arr[0] === '/help') {
      alert('Chat commands: /setname, /setplayer');
    } else {
      alert('Unknown chat command. Type /commands for a list of chat commands.');
    }
  }

  // Closes modal.
  close = () => this.setState({ open: false });

  modalStyles = {
    textAlign: 'center', 
    fontSize: '100px', 
    fontFamily: "'Lobster Two', cursive",
    fontStyle: 'italic',
    color: '#ff5f2e'
  }

  render() {
    const { open, win, player, currentPlayer } = this.state;
    return(
      <div className="ui container" style={{ marginTop: '50px' }}>
        <h1 style={this.modalStyles}>Connect 4</h1>
        <div 
          className="ui header" 
          style={{ textAlign: 'center', paddingBottom: '10px' }} 
          data-tooltip="Send the URL to a friend so they can join the game!" 
          data-position="top center"
        > 
          {player === 'red' || player === 'yellow' ? `You are ${player}. It's ${currentPlayer}'s turn.` : `You are spectating. It's ${currentPlayer}'s turn.`}
        </div>
        <div className="ui grid">       
          <Board 
            board={this.state.board} 
            sendMove={this.sendMove} 
            getBoardState={this.getBoardState} 
            turn={this.turn}
          />          
          <div className="five wide column" style={{ height: '67vh', backgroundColor: 'darkgrey' }}>
            <Chat 
              name={this.props.name || this.state.player} 
              socket={this.state.socket}
              messages={this.state.messages}
              chatCommands={this.chatCommands}
            />
          </div>
        </div>

        <Modal
          dimmer={true}
          open={open}
          closeOnEscape={true}
          closeOnDimmerClick={true}
          onClose={this.close}
          basic size='small'        
        >
          <Modal.Content>
            <h1 style={this.modalStyles}>{win !== 'Tie' ? `${win.charAt(0).toUpperCase()+win.slice(1)} wins!` : "It's a tie!"}</h1>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default Room;