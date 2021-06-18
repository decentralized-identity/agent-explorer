import React, { useEffect, useState } from 'react'
import { Input, Button, Row } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { useVeramo } from '@veramo-community/veramo-react'
import { useChat } from '../../context/ChatProvider'
import { v4 } from 'uuid'
import { useHistory } from 'react-router-dom'

const { TextArea } = Input

interface ChatInputProps {
  viewer: string
  recipient?: string
  threadId: string
}

const ChatInput: React.FC<ChatInputProps> = ({
  viewer,
  recipient: existingRecipient,
  threadId,
}) => {
  const [message, setMessage] = useState<string>()
  const { agent } = useVeramo()
  const { composing, setComposing, newRecipient, setNewRecipient } = useChat()
  const recipient = existingRecipient || newRecipient
  const history = useHistory()
  const _threadId = threadId === 'new-thread' ? v4() : threadId

  console.log('recipient', recipient)

  const sendMessage = async (msg: string) => {
    await agent?.sendMessageDIDCommAlpha1({
      data: {
        id: _threadId,
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

    setMessage('')

    if (composing) {
      setNewRecipient('')
      setComposing(false)

      history.push('/chats/threads/' + _threadId)
    }
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
        height: 120,
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
        disabled={!message || !recipient}
        type="link"
        icon={<SendOutlined style={{ fontSize: 28 }} />}
        onClick={() => message && sendMessage(message)}
      />
    </Row>
  )
}

export default ChatInput
