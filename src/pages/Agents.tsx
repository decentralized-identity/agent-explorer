import React, { useState } from 'react'
import { Typography, Card, Button, Row, Space, Input } from 'antd'
import Page from '../layout/Page'
import { useVeramo } from '@veramo-community/veramo-react'
import { DeleteOutlined } from '@ant-design/icons'
const { Title, Text } = Typography

const Agents = () => {
  const { agents, removeAgent } = useVeramo()

  const [names, setNames] = useState({})

  return (
    <Page header={<Title style={{ fontWeight: 'bold' }}>Agents</Title>}>
      {agents.map((agent) => {
        return (
          <Card key={agent.context.id}>
            <Title>{agent.context.name}</Title>
            <Row style={{ marginBottom: 20 }}>
              <code>Schema: {agent.context.schema}</code>
            </Row>

            <Space>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() =>
                  agent.context.id && removeAgent(agent.context.id)
                }
              >
                Delete Agent
              </Button>
              <Button
                icon={<DeleteOutlined />}
                onClick={() =>
                  agent.context.id && removeAgent(agent.context.id)
                }
              >
                Save
              </Button>
            </Space>
          </Card>
        )
      })}
    </Page>
  )
}

export default Agents
