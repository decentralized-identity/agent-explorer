import { useParams } from 'react-router-dom'
import ChatThread from '../components/ChatThread'
import ChatScrollPanel from '../components/ChatScrollPanel'
import ChatWindow from '../components/ChatWindow'
import ChatHeader from '../components/ChatHeader'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { useChat } from '../context/ChatProvider'
import { IDataStoreORM, IMessage } from '@veramo/core'
import { useEffect } from 'react'
import { Col, Row, theme } from 'antd'
const { useToken } = theme

const groupBy = (arr: any[], property: string) => {
  return arr.reduce((acc, cur) => {
    acc[cur[property]] = [...(acc[cur[property]] || []), cur]
    return acc
  }, {})
}

interface IsSenderTaggedMessage extends IMessage {
  isSender: boolean
}

const ChatView = () => {
  const { token } = useToken()
  const { agent } = useVeramo<IDataStoreORM>()
  const { selectedDid } = useChat()
  const { threadId } = useParams<{ threadId: string }>()
  const { data: threads, refetch } = useQuery(
    ['threads', { id: agent?.context.id, selectedDid, threadId }],
    async () => {
      const messages = await agent?.dataStoreORMGetMessages({
        where: [{ column: 'type', value: ['veramo.io-chat-v1'] }],
        order: [{ column: 'createdAt', direction: 'DESC' }],
      })
      // TODO: should be able to do this filter in the query instead of here
      const applicableMessages = (messages as IMessage[])?.filter(
        (message) => message.from === selectedDid || message.to === selectedDid,
      )

      const senderTagged: IsSenderTaggedMessage[] = applicableMessages?.map(
        (message: any) => {
          return {
            ...message,
            isSender: message.from === selectedDid,
          }
        },
      )

      if (senderTagged) {
        const grouped = groupBy(senderTagged, 'threadId')
        return grouped
      }
    },
    {
      refetchInterval: 5000,
    },
  )
  useEffect(() => {
    refetch()
  }, [selectedDid, refetch, threadId])

  return (
    <div
      style={{
        height: 'calc(100vh - 86px)',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${token.colorBorder}`,
        borderRadius: token.borderRadius,
      }}
    >
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <ChatHeader />
        </Col>
      </Row>
      <Row style={{ flexGrow: 1 }}>
        <Col
          xs={10}
          sm={10}
          md={10}
          lg={10}
          xl={8}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            height: 'calc(100vh - 167px)',
            backgroundColor: token.colorFillContent,
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
                    threadSelected={index === threadId}
                  />
                )
              })}
          </ChatScrollPanel>
        </Col>
        <Col xs={14} sm={14} md={14} lg={14} xl={16}>
          <ChatWindow />
        </Col>
      </Row>
    </div>
  )
}

export default ChatView
