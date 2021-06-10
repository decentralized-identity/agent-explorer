import React from 'react'
import { Col } from 'antd'

interface ChatScrollPanelProps {
  reverse?: boolean
}

const ChatScrollPanel: React.FC<ChatScrollPanelProps> = ({
  children,
  reverse,
}) => {
  const reverseStyles = reverse
    ? {
        justifyContent: 'flex-end',
        display: 'flex',
        paddingBottom: 100,
      }
    : {}

  return (
    <Col
      className={'hide-scroll'}
      style={{
        ...(reverse ? reverseStyles : {}),
        flexDirection: 'column',
        flex: 1,
        overflow: 'scroll',
        height: '96vh',
      }}
    >
      {children}
    </Col>
  )
}

export default ChatScrollPanel
