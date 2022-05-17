import React from 'react'
import { Row } from 'antd'

interface ChatBubbleProps {
  text: string
  isSender?: boolean
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, isSender }) => {
  return (
    <Row
      style={{
        justifyContent: isSender ? 'flex-end' : 'flex-start',
        padding: 20,
      }}
    >
      <div
        style={{
          background: isSender ? '#5e9dff' : '#fff',
          color: isSender ? '#fff' : '#000',
          padding: '10px 20px',
          borderRadius: 5,
          boxShadow: '2px 2px 1px rgba(0,0,0,0.2)',
        }}
      >
        {text}
      </div>
    </Row>
  )
}

export default ChatBubble
