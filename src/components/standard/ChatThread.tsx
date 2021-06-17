import React from 'react'
import { Row, Typography, Avatar } from 'antd'
import { useHistory } from 'react-router'
import { useChat } from '../../context/ChatProvider'
import { identiconUri } from '../../utils/identicon'

const { Title, Text } = Typography

interface ChatThreadProps {
  thread: any
  threadId: string
}

const ChatThread: React.FC<ChatThreadProps> = ({ thread, threadId }) => {
  const { selectedDid, setComposing } = useChat()
  const history = useHistory()
  const lastMessage = thread[0]
  const { body } = lastMessage && JSON.parse(lastMessage.raw)
  const viewThread = () => {
    setComposing(false)
    history.push(`/chats/threads/${threadId}`)
  }

  return (
    <Row
      onClick={() => viewThread()}
      style={{
        cursor: 'pointer',
        padding: 20,
        backgroundColor: '#f7f7f7',
        alignItems: 'center',
        borderBottom: '1px solid white',
      }}
    >
      <Avatar
        src={
          lastMessage.from === selectedDid
            ? identiconUri(lastMessage.to)
            : identiconUri(lastMessage.from)
        }
        size={50}
        style={{ marginRight: 15 }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Title level={5} style={{ marginBottom: 0 }}>
          {lastMessage.isSender ? lastMessage.to : lastMessage.from}
        </Title>
        <Text>{body.message}</Text>
      </div>
    </Row>
  )
}

export default ChatThread
