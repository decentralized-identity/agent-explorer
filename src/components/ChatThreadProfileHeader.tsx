import React from 'react'
import { Row, Typography, Avatar, Col, theme } from 'antd'
import { identiconUri } from '../utils/identicon'
import { shortId } from '../utils/did'
import { IMessage } from '@veramo/core'
import { useChat } from '../context/ChatProvider'
const { useToken } = theme
const { Text } = Typography

interface ChatThreadProfileHeaderProps {
  did: string
  profileCredential?: any
  onRowClick?: any
  selected?: boolean
  lastMessage?: IMessage
}

const ChatThreadProfileHeader: React.FC<ChatThreadProfileHeaderProps> = ({
  did,
  profileCredential,
  onRowClick,
  selected,
  lastMessage,
}) => {
  const { token } = useToken()
  const { selectedDid } = useChat()

  return (
    <Row
      onClick={onRowClick}
      style={{
        cursor: 'pointer',
        padding: 20,
        backgroundColor: selected ? token.colorPrimaryBg : 'transparent',
        alignItems: 'center',
        borderRadius: token.borderRadius,
      }}
    >
      <Col>
        <Avatar
          src={
            profileCredential
              ? profileCredential.credentialSubject.avatar
              : identiconUri(did)
          }
          size={50}
          style={{ marginRight: 15 }}
        />
      </Col>
      <Col style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {profileCredential ? (
          <Col>
            <Row>
              <Text style={{ marginBottom: 0 }} strong>
                {profileCredential.credentialSubject.name}
              </Text>
            </Row>
            <Row>
              <Text>{shortId(did)}</Text>
            </Row>
          </Col>
        ) : (
          <div>
            <Text style={{ marginBottom: 0 }} strong>
              {shortId(did)}
            </Text>
          </div>
        )}
        {lastMessage && lastMessage.type === 'veramo.io-chat-v1' && (
          <Text style={{ color: token.colorTextSecondary }}>
            {lastMessage.from === selectedDid && 'You: '}
            {(lastMessage.data as any).message}
          </Text>
        )}
      </Col>
    </Row>
  )
}

export default ChatThreadProfileHeader
