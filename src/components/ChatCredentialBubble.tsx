import React from 'react'
import { Row, theme } from 'antd'
import { VerifiableCredential } from '@veramo/core'
import { VerifiableCredential as VComponent } from '@veramo-community/react-components'
const { useToken } = theme

interface ChatBubbleProps {
  credential: VerifiableCredential
  isSender?: boolean
}

const ChatCredentialBubble: React.FC<ChatBubbleProps> = ({ credential, isSender }) => {
  const { token } = useToken()
  return (
    <Row
      style={{
        justifyContent: isSender ? 'flex-end' : 'flex-start',
        paddingRight: 15,
        paddingLeft: 15,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          background: isSender
            ? token.colorPrimaryBorderHover
            : token.colorBgContainer,
          padding: '10px 20px',
          borderRadius: 20,
          boxShadow: '1px 1px 1px rgba(0,0,0,0.1)',
          color: token.colorText,
        }}
      >
        <VComponent credential={credential} />
      </div>
    </Row>
  )
}

export default ChatCredentialBubble
