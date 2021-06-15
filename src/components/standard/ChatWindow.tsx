import React from 'react'
import { Input } from 'antd'
import ChatThread from '../../components/standard/ChatThread'
import ChatScrollPanel from '../../components/standard/ChatScrollPanel'
import ChatBubble from '../../components/standard/ChatBubble'
import ChatInput from '../../components/standard/ChatInput'
import { useParams } from 'react-router'
import tile from '../../static/img/tile.png'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'

interface ChatWindowProps {}

const ChatWindow: React.FC<ChatWindowProps> = () => {
  const { threadId } = useParams<{ threadId: string }>()
  const { agent } = useVeramo()
  const { data: messages } = useQuery(
    ['chats', { id: agent?.context.id }],
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
  )

  return (
    <div
      style={{
        backgroundImage: `url(${tile})`,
        backgroundRepeat: 'repeat',
      }}
    >
      <ChatScrollPanel reverse>
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

      {/* <ChatScrollPanel reverse>{mes}</ChatScrollPanel> */}
      {/* <ChatInput></ChatInput> */}
    </div>
  )
}

export default ChatWindow
