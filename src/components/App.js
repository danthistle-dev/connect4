import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Menu from './Menu';
import Room from './Room';
import Game from '../game';

class App extends React.Component {

  state = { name: '', gameId: null }

  onNameChange = e => {
    this.setState({ name: e.target.value });
  }

  createGame = () => {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      this.setState({ gameId: JSON.parse(xhr.responseText) });
    });
    xhr.open('POST', 'http://localhost:4000/api/creategame');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ name: this.state.name, board: Game.initBoard(), messages: [], currentColour: 'red' }));
  }

  render() {
    return (
      <Router>
        <Route 
          exact path="/"
          render={(routeProps) => (
            <Menu 
              {...routeProps} 
              name={this.state.name} 
              onNameChange={this.onNameChange}
              gameId={this.state.gameId}
              createGame={this.createGame}
            />
          )} 
        />
        <Route 
          exact path="/:gameId"
          render={(routeProps) => (
            <Room 
              {...routeProps} 
              name={this.state.name}
              gameId={this.state.gameId}
            /> 
          )}
        />
      </Router>
    );
  }
}

export default App;