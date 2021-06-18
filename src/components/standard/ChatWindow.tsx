import React, { useEffect } from 'react'
import ChatScrollPanel from '../../components/standard/ChatScrollPanel'
import ChatBubble from '../../components/standard/ChatBubble'
import ChatInput from '../../components/standard/ChatInput'
import { useParams } from 'react-router'
import tile from '../../static/img/tile.png'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { scrollMessages } from '../../utils/scroll'
import { useChat } from '../../context/ChatProvider'

interface ChatWindowProps {}

const ChatWindow: React.FC<ChatWindowProps> = () => {
  const { threadId } = useParams<{ threadId: string }>()
  const { selectedDid } = useChat()
  const newThread = threadId === 'new-thread'
  const { agent } = useVeramo()

  const { data: messages } = useQuery(
    ['chats', { id: agent?.context.id, threadId: threadId }],
    async () => {
      const owned = await agent?.didManagerFind()
      const _messages = await agent?.dataStoreORMGetMessages({
        where: [{ column: 'threadId', value: [threadId] }],
        order: [{ column: 'createdAt', direction: 'ASC' }],
      })
      return _messages?.map((_msg: any) => {
        return {
          ..._msg,
          isSender: owned?.map((a: any) => a.did).includes(_msg.from),
        }
      })
    },
    {
      refetchInterval: 1000,
      enabled: !newThread,
    },
  )

  useEffect(() => {
    scrollMessages()
  }, [messages])

  return (
    <div
      style={{
        backgroundImage: `url(${tile})`,
        backgroundRepeat: 'repeat',
      }}
    >
      <ChatScrollPanel reverse id="chat-window">
        {messages?.map((message) => {
          return (
            <ChatBubble
              // @ts-ignore
              text={message?.data?.message}
              key={message.id}
              // @ts-ignore
              isSender={message.isSender}
            />
          )
        })}
      </ChatScrollPanel>
      {(messages || newThread) && (
        <ChatInput
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
