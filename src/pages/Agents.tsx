import React from 'react'
import { Typography, Card, Button, Row, Space, Tag } from 'antd'
import Page from '../layout/Page'
import { useVeramo } from '@veramo-community/veramo-react'
import {
  DeleteOutlined,
  PushpinOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography

const Agents = () => {
  const navigate = useNavigate()
  const { agents, removeAgent, activeAgentId, setActiveAgentId } = useVeramo()

  return (
    <Page header={<Title style={{ fontWeight: 'bold' }}>Agents</Title>}>
      {agents.map((agent) => {
        return (
          <Card key={agent.context.id}>
            <Row>
              <Title>{agent.context.name}</Title>
            </Row>
            <Row style={{ marginBottom: 20 }}>
              {activeAgentId === agent.context.id && (
                <Tag color="geekblue">Default Agent</Tag>
              )}
              <Tag color="">Schema</Tag>
              <Tag color="">W3C</Tag>
            </Row>
            <Row style={{ marginBottom: 20 }}>
              <code>Schema: {agent.context.schema}</code>
            </Row>
            <Space>
              <Button
                icon={<DeleteOutlined />}
                disabled={activeAgentId === agent.context.id}
                danger
                onClick={() =>
                  agent.context.id && removeAgent(agent.context.id)
                }
              >
                Remove Agent
              </Button>
              <Button
                icon={<PushpinOutlined />}
                disabled={activeAgentId === agent.context.id}
                onClick={() =>
                  agent.context.id && setActiveAgentId(agent.context.id)
                }
              >
                Make Default
              </Button>
              <Button
                onClick={() => navigate('/agent/' + agent.context.id)}
                icon={<EditOutlined />}
              >
                Manage
              </Button>
            </Space>
          </Card>
        )
      })}
    </Page>
  )
}

export default Agents
