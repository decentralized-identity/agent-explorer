import React, { useEffect, useState } from 'react'
import { Input, Button, Row } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { useVeramo } from '@veramo-community/veramo-react'

const { TextArea } = Input

interface ChatInputProps {
  viewer: string
  recipient: string
  threadId: string
}

const ChatInput: React.FC<ChatInputProps> = ({
  viewer,
  recipient,
  threadId,
}) => {
  const [message, setMessage] = useState<string>()
  const { agent } = useVeramo()

  const sendMessage = async (msg: string) => {
    await agent?.sendMessageDIDCommAlpha1({
      data: {
        id: threadId,
        from: viewer as string,
        to: recipient as string,
        type: 'veramo.io-chat-v1',
        body: {
          message: msg,
        },
        // @ts-ignore
        iat: new Date().getTime(),
      },
      save: true,
    })

    setMessage(' ')
  }

  return (
    <Row
      style={{
        flexFlow: 'nowrap',
        background: '#eaeaea',
        padding: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 150,
      }}
    >
      <TextArea
        style={{ marginRight: 20 }}
        placeholder={`Sending from ` + viewer}
        autoSize
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        disabled={!message}
        type="link"
        icon={<SendOutlined style={{ fontSize: 28 }} />}
        onClick={() => message && sendMessage(message)}
      />
    </Row>
  )
}

export default ChatInput
