import React from 'react'
import { Row, theme } from 'antd'
const { useToken } = theme
import { MarkDown } from '@veramo-community/agent-explorer-plugin'

interface ChatBubbleProps {
  text: string
  isSender?: boolean
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, isSender }) => {
  const { token } = useToken()
  return (
    <Row
      style={{
        justifyContent: isSender ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          background: isSender
            ? token.colorBgElevated
            : token.colorBgContainer,
          paddingLeft: token.padding,
          paddingRight: token.padding,
          marginTop: token.marginXS,
          marginLeft: token.marginXS,
          marginRight: token.marginXS,
          borderRadius: token.borderRadius,
          boxShadow: '1px 1px 1px rgba(0,0,0,0.1)',
          color: token.colorText,
        }}
      >
        <MarkDown content={text} />
      </div>
    </Row>
  )
}

export default ChatBubble
