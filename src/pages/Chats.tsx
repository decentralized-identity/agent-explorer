import React from 'react'
import Page from '../layout/SplitPage'
import tile from '../static/img/tile.png'
import ChatThread from '../components/standard/ChatThread'
import ChatScrollPanel from '../components/standard/ChatScrollPanel'
import ChatBubble from '../components/standard/ChatBubble'
import ChatInput from '../components/standard/ChatInput'

const ChatView = () => {
  return (
    <Page
      name="chats"
      header={
        <div
          style={{
            backgroundColor: '#eaeaea',
            borderBottom: '1px solid white',
            height: 65,
          }}
        ></div>
      }
      leftContent={
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <ChatScrollPanel>
            <ChatThread />
            <ChatThread />
            <ChatThread />
            <ChatThread />
          </ChatScrollPanel>
        </div>
      }
      rightContent={
        <div
          style={{
            backgroundImage: `url(${tile})`,
            backgroundRepeat: 'repeat',
          }}
        >
          <ChatScrollPanel reverse>
            <ChatBubble text="sssss" />
            <ChatBubble isIssuer text="sssss" />
            <ChatBubble isIssuer text="sssss" />
            <ChatBubble text="sssss" />
            <ChatBubble isIssuer text="sssss" />
            <ChatBubble text="sssss" />
            <ChatBubble isIssuer text="sssss" />
          </ChatScrollPanel>
          <ChatInput />
        </div>
      }
    ></Page>
  )
}

export default ChatView
