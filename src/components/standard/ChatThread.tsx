import React from 'react'
import { Row, Typography, Avatar } from 'antd'
import user1 from '../../static/img/user1.jpeg'

const { Title, Text } = Typography

interface ChatThreadProps {}

const ChatThread: React.FC<ChatThreadProps> = () => {
  return (
    <Row
      style={{
        padding: 20,
        backgroundColor: '#f7f7f7',
        alignItems: 'center',
        borderBottom: '1px solid white',
      }}
    >
      <Avatar src={user1} size={50} style={{ marginRight: 15 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Title level={5} style={{ marginBottom: 0 }}>
          Bruce Wayne
        </Title>
        <Text>okay, i guess we can check that out. Do you...</Text>
      </div>
    </Row>
  )
}

export default ChatThread
