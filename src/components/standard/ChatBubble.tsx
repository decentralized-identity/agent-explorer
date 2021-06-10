import React from 'react'
import { Row, Typography } from 'antd'

interface ChatBubbleProps {
  text: string
  isIssuer?: boolean
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, isIssuer }) => {
  return (
    <Row
      style={{
        justifyContent: isIssuer ? 'flex-end' : 'flex-start',
        padding: 20,
      }}
    >
      <div
        style={{
          background: isIssuer ? '#5e9dff' : '#fff',
          color: isIssuer ? '#fff' : '#000',
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
