import React, { useState } from 'react'
import {
  Typography,
  Card,
  Button,
  Row,
  Space,
  Tag,
  Layout,
  Col,
  Input,
} from 'antd'
import Page from '../layout/Page'
import { useVeramo } from '@veramo-community/veramo-react'
import { PushpinOutlined, DatabaseOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import Chart from '../components/standard/Chart'
import { chart1 } from '../stubbs/chart'

const { Title, Text } = Typography

const Agents = () => {
  const { id } = useParams<{ id: string }>()
  const { activeAgentId, setActiveAgentId, getAgent } = useVeramo()
  const agent = getAgent(id)
  const [agentNameConfirm, setAgentNameConfirm] = useState<string>()

  return (
    <Page
      name="agent"
      rightContent={
        <Layout>
          <Card title="Example chart">
            <Chart type="line" data={chart1}></Chart>
          </Card>
        </Layout>
      }
      header={
        <Layout>
          <Title style={{ fontWeight: 'bold' }}>{agent.context.name}</Title>
          {/* <Row>
            {activeAgentId === agent.context.id && (
              <Tag color="geekblue">Default Agent</Tag>
            )}
            <Tag color="">Schema</Tag>
            <Tag color="">W3C</Tag>
          </Row> */}
        </Layout>
      }
    >
      <Card title="Agent info">
        <Row>
          <Space>
            <Button
              icon={<PushpinOutlined />}
              disabled={activeAgentId === agent.context.id}
              onClick={() =>
                agent.context.id && setActiveAgentId(agent.context.id)
              }
            >
              Make Default
            </Button>
          </Space>
        </Row>
      </Card>

      {/* <Card title="Wipe Agent Data">
        <Row>
          <Col>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <Text>
                To erase all data from this agent please enter the name of the
                agent below:
              </Text>
              <Input
                placeholder="Enter agent name"
                style={{ width: 300 }}
                onChange={(e) => setAgentNameConfirm(e.target.value)}
              />
              <Button
                danger
                icon={<DatabaseOutlined />}
                disabled={agentNameConfirm !== agent.context.name}
              >
                Yes, I'm sure
              </Button>
            </Space>
          </Col>
        </Row>
      </Card> */}
    </Page>
  )
}

export default Agents
