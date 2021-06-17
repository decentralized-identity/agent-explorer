import React, { useState } from 'react'
import { Row, Col, Typography, Avatar, Button, Input } from 'antd'
import { useChat } from '../../context/ChatProvider'
import { identiconUri } from '../../utils/identicon'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { FormOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'

interface ChatHeaderProps {}

const ChatHeader: React.FC<ChatHeaderProps> = ({}) => {
  const { agent } = useVeramo()
  const [uri, setUri] = useState<string>()
  const {
    selectedDid,
    setSelectedDid,
    composing,
    setComposing,
    newRecipient,
    setNewRecipient,
  } = useChat()
  const history = useHistory()
  const composeNewThread = () => {
    history.push('/chats/threads/new-thread')
    setComposing(true)
  }

  useQuery(
    ['identifiers', { id: agent?.context.id }],
    () => agent?.didManagerFind(),
    {
      onSuccess: (data) => {
        if (data) {
          setSelectedDid(data[0].did)
          setUri(identiconUri(data[0].did))
        }
      },
    },
  )

  return (
    <Row
      style={{
        backgroundColor: '#eaeaea',
        borderBottom: '1px solid white',
        height: 80,
        alignItems: 'center',
      }}
    >
      <Col xs={10} sm={10} md={10} lg={10} xl={8}>
        <Row
          style={{
            alignItems: 'center',
          }}
        >
          <Col>
            {uri ? (
              <Avatar size={35} src={uri} style={{ marginLeft: 27 }} />
            ) : (
              <Avatar size={50} />
            )}
          </Col>
          <Col style={{ marginLeft: 24, flex: 1 }}>
            <Typography.Text>{selectedDid}</Typography.Text>
          </Col>
          <Button
            onClick={() => composeNewThread()}
            style={{ marginRight: 20 }}
            icon={<FormOutlined style={{ fontSize: 20 }} />}
            type={'text'}
          />
        </Row>
      </Col>
      <Col xs={14} sm={14} md={14} lg={14} xl={16}>
        {composing && (
          <Row
            style={{
              alignItems: 'center',
            }}
          >
            <Col>
              <Avatar size={50} />
            </Col>
            <Col
              flex={1}
              style={{
                paddingLeft: 15,
                paddingRight: 24,
              }}
            >
              <Row>
                <Input
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                />
              </Row>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  )
}

export default ChatHeader
