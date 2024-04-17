import React from 'react'
import { Row, theme } from 'antd'
const { useToken } = theme
import { usePlugins } from '@veramo-community/agent-explorer-plugin'
import { IMessage } from '@veramo/core-types'
import { ChatMarkdown } from './ChatMarkdown'

export interface ChatBubbleProps {
  message: IMessage & { isSender: boolean }
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { isSender } = message
  const { plugins }  = usePlugins()
  const { token } = useToken()

  let Component: React.FC<ChatBubbleProps> | undefined = undefined
  plugins.forEach((plugin) => {
    if (Component === undefined && plugin.getMessageComponent) {
      const Obj = plugin.getMessageComponent(message)
      if (Obj) {
        Component = Obj
      }
    }
  })

  if (Component === undefined) {
    Component = ChatMarkdown
  }

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
        <Component message={message} />
      </div>
    </Row>
  )
}

export default ChatBubble
