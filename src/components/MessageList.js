import React from 'react';
import Message from './Message';

const MessageList = ({ messages }) => {

  const list = messages.map((message, i) => {
    return <Message message={message.msg} sender={message.auth} key={i} />
  })

  return(
    <div className="ui small comments">
      {list}
    </div>
  );
}

export default MessageList;