import React from 'react';

class Message extends React.Component {

  render() {
    return(
      <div className="ui message">
        <div className="header">
          {this.props.sender}         
        </div>
        <p>{this.props.message}</p>      
      </div> 
    );
  }
}

export default Message;