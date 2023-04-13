import React from 'react'
import { Row, Typography, Avatar, Col, theme } from 'antd'
import { identiconUri } from '../../utils/identicon'
const { useToken } = theme
const { Text } = Typography

interface ChatThreadProfileHeaderProps {
  did: string
  profileCredential?: any
  onRowClick?: any
  selected?: boolean
}

const ChatThreadProfileHeader: React.FC<ChatThreadProfileHeaderProps> = ({
  did,
  profileCredential,
  onRowClick,
  selected,
}) => {
  const { token } = useToken()
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
              <Text>{did}</Text>
            </Row>
          </Col>
        ) : (
          <div>
            <Text style={{ marginBottom: 0 }} strong>
              {did}
            </Text>
          </div>
        )}
      </Col>
    </Row>
  )
}

export default ChatThreadProfileHeader
