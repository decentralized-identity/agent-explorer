import React, { useEffect } from 'react'
import { InfoCircleOutlined, LeftOutlined } from '@ant-design/icons'
import ChatScrollPanel from './ChatScrollPanel'
import ChatBubble from './ChatBubble'
import ChatInput from './ChatInput'
import { useNavigate, useParams } from 'react-router'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { scrollMessages } from '../utils/scroll'
import { useChat } from '../context/ChatProvider'
import IdentifierProfile from './IdentifierProfile'
import { Button, Col, Row, theme } from 'antd'
import ChatCredentialBubble from './ChatCredentialBubble'
import { ML_TEXT_GENERATION_QUESTION_MESSAGE_TYPE, ML_TEXT_GENERATION_RESPONSE_MESSAGE_TYPE } from 'ml-veramo-message-handler'

interface ChatWindowProps {
  msgType: string
}
const ChatWindow: React.FC<ChatWindowProps> = ({ msgType }) => {
  const { threadId } = useParams<{ threadId: string }>()
  const { selectedDid, newRecipient } = useChat()
  const newThread = threadId === 'new-thread'
  const { agent } = useVeramo()
  const { token } = theme.useToken()
  const navigate = useNavigate()

  const { data: messages, refetch } = useQuery(
    ['chats', { id: agent?.context.id, threadId: threadId }],
    async () => {
      const _messages = await agent?.dataStoreORMGetMessages({
        where: [{ column: 'threadId', value: [threadId] }],
        order: [{ column: 'createdAt', direction: 'ASC' }],
      })
      return _messages?.map((_msg: any) => {
        return {
          ..._msg,
          isSender: _msg.from === selectedDid,
        }
      })
    },
    {
      refetchInterval: 5000,
      enabled: !newThread,
    },
  )
  const lastMessage =
    threadId && messages && messages.length > 0 && messages[messages.length - 1]
  const counterParty = lastMessage
    ? {
        did:
          lastMessage.from === selectedDid ? lastMessage.to : lastMessage.from,
      }
    : { did: newRecipient }
  useEffect(() => {
    scrollMessages()
  }, [messages])
  useEffect(() => {
    refetch()
  }, [selectedDid, refetch])

  if (
    !newThread &&
    selectedDid !== lastMessage?.to &&
    selectedDid !== lastMessage?.from
  ) {
    return <div></div>
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: 'calc(100vh - 220px)',
      }}
    >
      <Row
        style={{
          width: '100%',
          padding: token.padding,
          borderBottom: '1px solid ' + token.colorBorder,
          marginBottom: token.margin,
        }}
        justify={'space-between'}
        wrap={false}
      >
        <Col xs={3} sm={{ span: 0 }}>
          <Button
            type="text"
            onClick={() => navigate(msgType === 'starchat' ? 'starchats/threads' : '/chats/threads')}
            size={'large'}
          >
            <LeftOutlined />
          </Button>
        </Col>
        <Col xs={19}>
          <IdentifierProfile did={counterParty.did} showShortId={false} />
        </Col>
        <Col xs={2}>
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => navigate('/identifier/' + counterParty.did)}
          />
        </Col>
      </Row>
      <ChatScrollPanel reverse id="chat-window">
        {messages?.map((message: any) => {
          if (message.type === 'veramo.io-chat-v1' || message.type === ML_TEXT_GENERATION_QUESTION_MESSAGE_TYPE) {
            return (
              <ChatBubble
                // @ts-ignore
                text={message?.data?.message || message?.data?.queryInput}
                key={message.id}
                // @ts-ignore
                isSender={message.isSender}
              />
            )
          }
          else if (message.type === ML_TEXT_GENERATION_RESPONSE_MESSAGE_TYPE) {
            return (
              <ChatCredentialBubble
              credential={message?.data}
              key={message.id}
              // @ts-ignore
              isSender={message.isSender}
              />
            )
          }
        })}
      </ChatScrollPanel>
      {(messages || newThread) && (
        <ChatInput
          msgType={msgType}
          threadId={threadId}
          viewer={selectedDid}
          recipient={
            messages && messages.length > 0 && messages[0].from !== selectedDid
              ? messages && messages.length > 0 && messages[0].from
              : messages && messages.length > 0 && messages[0].to
          }
        />
      )}
    </div>
  )
}

export default ChatWindow
