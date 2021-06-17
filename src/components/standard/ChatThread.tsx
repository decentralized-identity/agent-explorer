import React from 'react'
import { Row, Typography, Avatar } from 'antd'
import user1 from '../../static/img/user1.jpeg'
import user2 from '../../static/img/user3.jpeg'
import { useHistory } from 'react-router'
import { useChat } from '../../context/ChatProvider'
import { identiconUri } from '../../utils/identicon'

const { Title, Text } = Typography

interface ChatThreadProps {
  thread: any
  threadId: string
}

const ChatThread: React.FC<ChatThreadProps> = ({ thread, threadId }) => {
  const { selectedDid } = useChat()
  const history = useHistory()
  const lastMessage = thread[0]
  const { body } = lastMessage && JSON.parse(lastMessage.raw)

  return (
    <Row
      onClick={() => history.push(`/chats/${threadId}`)}
      style={{
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
