import React from 'react';
import { Redirect } from 'react-router-dom';

const containerStyles = {
  height: '100vh',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center',
  flexWrap: 'wrap'
}

const segmentStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center',
  flexWrap: 'wrap',
  height: '35vh',
  backgroundColor: '#fff5f3'
}

const titleStyles = {
  textAlign: 'center', 
  fontSize: '72px', 
  fontFamily: "'Lobster Two', cursive",
  fontStyle: 'italic',
  color: '#ff5f2e'
}

const Menu = ({ onNameChange, name, gameId, createGame }) => {
  return(
    <div className="ui container" style={containerStyles}>
      <div className="ui raised compact segment" style={segmentStyles}>
      <form className="ui big form" onSubmit={e => e.preventDefault()}>
      <h1 style={titleStyles}>Connect 4</h1>
      <div className="field">
        <label>
          Enter your name:
          <input 
            type="text"
            value={name}
            onChange={onNameChange}
          />
        </label>
      </div>       
      {gameId !== null ? <Redirect to={gameId}/> : null}
      {name !== '' ? (
        <button className="ui big fluid orange basic button" onClick={createGame}>Start Game</button>
      ) : (
        <button className="ui big fluid orange basic disabled button">Start Game</button>
      )}
      </form>
      </div>
    </div>
  );
}

export default Menu;