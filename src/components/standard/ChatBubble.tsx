import React from 'react'
import { Row } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'

interface ChatBubbleProps {
  text: string
  isSender?: boolean
  attachment: any
  profile: any
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  text,
  isSender,
  attachment,
  profile,
}) => {
  const { agent } = useVeramo()
  let name = ''
  if (profile && !isSender && profile[0] && profile[0].profile) {
    name = profile[0].profile.verifiableCredential.credentialSubject.name
  }
  return (
    <div>
      <Row
        style={{
          justifyContent: isSender ? 'flex-end' : 'flex-start',
          padding: 20,
          paddingBottom: name ? 0 : 20,
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
      {name && (
        <Row
          style={{
            justifyContent: isSender ? 'flex-end' : 'flex-start',
            paddingRight: 30,
            paddingLeft: 30,
          }}
        >
          <div
            style={{
              color: '#666',
              fontSize: '10px',
            }}
          >
            {name}
          </div>
        </Row>
      )}
    </div>
  )
}

export default ChatBubble
