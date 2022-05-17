import { Route } from 'react-router-dom'
import Page from '../layout/SplitPage'
import ChatThread from '../components/standard/ChatThread'
import ChatScrollPanel from '../components/standard/ChatScrollPanel'
import ChatWindow from '../components/standard/ChatWindow'
import ChatHeader from '../components/standard/ChatHeader'
import Layout from 'antd/lib/layout/layout'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'

const groupBy = (arr: any[], property: string) => {
  return arr.reduce((acc, cur) => {
    acc[cur[property]] = [...(acc[cur[property]] || []), cur]
    return acc
  }, {})
}

const ChatView = () => {
  const { agent } = useVeramo()
  const { data: threads } = useQuery(
    ['threads', { id: agent?.context.id }],
    async () => {
      const owned = await agent?.didManagerFind()
      const messages = await agent?.dataStoreORMGetMessages({
        where: [{ column: 'type', value: ['veramo.io-chat-v1'] }],
        order: [{ column: 'createdAt', direction: 'DESC' }],
      })

      const senderTagged = messages?.map((message: any) => {
        return {
          ...message,
          isSender: owned?.map((a: any) => a.did).includes(message.from),
        }
      })

      if (senderTagged) {
        const grouped = groupBy(senderTagged, 'threadId')
        return grouped
      }
    },
    {
      refetchInterval: 5000,
    },
  )
  return (
    <Page
      name="chats"
      header={<ChatHeader />}
      leftContent={
        <Layout>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <ChatScrollPanel>
              {threads &&
                Object.keys(threads).map((index: any) => {
                  return (
                    <ChatThread
                      thread={threads[index]}
                      threadId={index}
                      key={index}
                    />
                  )
                })}
            </ChatScrollPanel>
          </div>
        </Layout>
      }
      rightContent={
        <Layout>
          <Route path="/chats/threads/:threadId" component={ChatWindow} />
        </Layout>
      }
    ></Page>
  )
}

export default ChatView
