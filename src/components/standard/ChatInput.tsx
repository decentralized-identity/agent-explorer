import React, { useState } from 'react'
import { Input, Button, Row, Col, Alert } from 'antd'
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
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { agent } = useVeramo()
  const { composing, setComposing, newRecipient, setNewRecipient } = useChat()
  const recipient = existingRecipient || newRecipient
  const history = useHistory()
  const _threadId = threadId === 'new-thread' ? v4() : threadId

  const messageId = v4()
  const sendMessage = async (msg: string) => {
    const message = {
      type: 'veramo.io-chat-v1',
      to: recipient as string,
      from: viewer as string,
      id: messageId,
      thid: _threadId,
      body: { message: msg },
    }
    let packedMessage
    try {
      packedMessage = await agent?.packDIDCommMessage({
        packing: 'jws',
        message,
      })
    } catch (err) {
      console.error('Error in packDIDCommMessage: ', err)
      setErrorMessage('Error Packing DIDComm Message. Check Logs')
    }
    if (packedMessage) {
      try {
        await agent?.sendDIDCommMessage({
          packedMessage,
          messageId,
          recipientDidUrl: recipient,
        })

        setMessage('')

        if (composing) {
          setNewRecipient('')
          setComposing(false)

          history.push('/chats/threads/' + _threadId)
        }
      } catch (err) {
        console.error('Error in sendDIDCommMessage: ', err)
        setErrorMessage('Error Sending DIDComm Message. Check Logs')
      }
    }
  }

  return (
    <Col
      style={{
        background: '#eaeaea',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        minHeight: 120,
      }}
    >
      <Row
        style={{
          flexFlow: 'nowrap',
          padding: 20,
          height: 120,
        }}
      >
        <TextArea
          style={{ marginRight: 20 }}
          placeholder={`Sending from ` + viewer}
          autoSize
          value={message}
          onChange={(e) => {
            setErrorMessage('')
            setMessage(e.target.value)
          }}
        />
        <Button
          disabled={!message || !recipient}
          type="link"
          icon={<SendOutlined style={{ fontSize: 28 }} />}
          onClick={() => message && sendMessage(message)}
        />
      </Row>
      {errorMessage && (
        <Row style={{ bottom: 0 }}>
          <br />
          <Alert message={errorMessage} type="error" />
        </Row>
      )}
    </Col>
  )
}

export default ChatInput