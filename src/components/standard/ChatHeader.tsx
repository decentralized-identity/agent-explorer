import React, { useState } from 'react'
import { Row, Col, Typography, Avatar, Button } from 'antd'
import { useChat } from '../../context/ChatProvider'
import { identiconUri } from '../../utils/identicon'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { FormOutlined } from '@ant-design/icons'

interface ChatHeaderProps {}

const ChatHeader: React.FC<ChatHeaderProps> = ({}) => {
  const { agent } = useVeramo()
  const [uri, setUri] = useState<string>()
  const { selectedDid, setSelectedDid } = useChat()

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
            style={{ marginRight: 20 }}
            icon={<FormOutlined style={{ fontSize: 20 }} />}
            type={'text'}
          />
        </Row>
      </Col>
      <Col>
        <Avatar size={50} />
      </Col>
    </Row>
  )
}

export default ChatHeader
