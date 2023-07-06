import React, { useState } from 'react'
import { Input, Button, Row, Col, Alert } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDCommMessage } from '@veramo/did-comm'
import { useChat } from '../context/ChatProvider'
import { v4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { shortId } from '../utils/did'
import { createMLTextGenerationQuestionMessage } from 'ml-veramo-message-handler'

const { TextArea } = Input

interface ChatInputProps {
  viewer: string
  recipient?: string
  threadId?: string
  msgType: string
}

const ChatInput: React.FC<ChatInputProps> = ({
  viewer,
  recipient: existingRecipient,
  threadId,
  msgType
}) => {
  const [message, setMessage] = useState<string>()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { agent } = useVeramo()
  const {
    selectedDid,
    composing,
    setComposing,
    newRecipient,
    setNewRecipient,
  } = useChat()
  const recipient = existingRecipient || newRecipient
  const navigate = useNavigate()
  const _threadId = threadId === 'new-thread' ? v4() : threadId
  const messageId = v4()
  const sendMessage = async (msg: string) => {
    let message: IDIDCommMessage = {
      type: 'veramo.io-chat-v1',
      to: recipient as string,
      from: selectedDid as string,
      id: messageId,
      thid: _threadId as string,
      body: { message: msg },
    }
    if (msgType === 'starchat') {
      message = createMLTextGenerationQuestionMessage(msg, selectedDid as string, recipient as string, _threadId as string, true)
    }
    let packedMessage
    try {
      packedMessage = await agent?.packDIDCommMessage({
        packing: 'authcrypt',
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

        const msgToSave = {
          type: message.type,
          to: message.to,
          from: message.from,
          id: message.id,
          threadId: message.thid,
          data: message.body,
        }

        await agent?.dataStoreSaveMessage({ message: msgToSave })

        setMessage('')

        if (composing) {
          setNewRecipient('')
          setComposing(false)

          if (msgType === 'starchat') {
            navigate('/starchats/threads/' + _threadId)
          } else {
            navigate('/chats/threads/' + _threadId)
          }
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        // minHeight: 120,
      }}
    >
      <Row
        style={{
          flexFlow: 'nowrap',
          padding: 10,
          // height: 120,
        }}
      >
        <TextArea
          style={{ marginRight: 20, borderRadius: 20 }}
          placeholder={`Sending from ` + shortId(viewer)}
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
          icon={<SendOutlined style={{ fontSize: 24 }} />}
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
