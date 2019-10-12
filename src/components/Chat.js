import React from 'react';
import MessageList from './MessageList';

class Chat extends React.Component {

  state = { message: '' }

  render() {
    return(
      <div>
        <div className="ui segment" style={{ height: '58vh', overflowY: 'scroll' }}>
          <MessageList messages={this.props.messages}/>
        </div>
        <div>
          <form 
            className="ui form" 
            onSubmit={e => {
              e.preventDefault();
              if (this.state.message.startsWith('/')) {
                this.props.chatCommands(this.state.message);
              } else {
                this.props.socket.emit('chat message', { 
                  msg: this.state.message, 
                  auth: this.props.name
                });
              }
              this.setState({ message: '' });
            }}
          >
            <div className="field">
              <div className="ui fluid action input">
                <input 
                  type="text"
                  value={this.state.message}
                  onChange={e => this.setState({ message: e.target.value })}
                  placeholder="Type message here..."
                />
                <button type="submit" className="ui icon button">
                  <i className="right arrow icon"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Chat;