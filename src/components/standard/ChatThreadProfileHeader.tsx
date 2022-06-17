import React from 'react'
import { Row, Typography, Avatar } from 'antd'
import { useHistory } from 'react-router'
import { useChat } from '../../context/ChatProvider'
import { identiconUri } from '../../utils/identicon'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'

const { Title, Text } = Typography

interface ChatThreadProfileHeaderProps {
  did: string
  profileCredential?: any
  onRowClick?: any
}

const ChatThreadProfileHeader: React.FC<ChatThreadProfileHeaderProps> = ({
  did,
  profileCredential,
  onRowClick,
}) => {
  return (
    <Row
      onClick={onRowClick}
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
          profileCredential
            ? profileCredential.credentialSubject.avatar
            : identiconUri(did)
        }
        size={50}
        style={{ marginRight: 15 }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {profileCredential ? (
          <div>
            <Title level={5} style={{ marginBottom: 0 }}>
              {profileCredential.credentialSubject.name}
            </Title>
            <Text>{did}</Text>
          </div>
        ) : (
          <div>
            <Title level={5} style={{ marginBottom: 0 }}>
              {did}
            </Title>
          </div>
        )}
      </div>
    </Row>
  )
}

export default ChatThreadProfileHeader
