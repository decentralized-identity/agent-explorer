import React from 'react'
import { Col } from 'antd'

interface ChatScrollPanelProps {
  reverse?: boolean
  id?: string
}

const ChatScrollPanel: React.FC<ChatScrollPanelProps> = ({
  children,
  reverse,
  id,
}) => {
  const reverseStyles = reverse
    ? {
        paddingBottom: 200,
        flexDirection: 'row-reverse',
      }
    : {
        flexDirection: 'column',
      }

  return (
    <Col
      className={'hide-scroll'}
      id={id}
      // @ts-ignore
      style={{
        ...(reverse ? reverseStyles : {}),
        flex: 3,
        overflow: 'scroll',
        // height: 'calc(100vh - 120px)',
      }}
    >
      <div id="scroll-items">{children}</div>
    </Col>
  )
}

export default ChatScrollPanel
