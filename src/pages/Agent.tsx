import React, { useState } from 'react'
import { Typography, Card, Button, Layout, Input, Form } from 'antd'
import Page from '../layout/Page'
import { useVeramo } from '@veramo-community/veramo-react'
import { PushpinOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import Chart from '../components/standard/Chart'
import { chart1 } from '../stubbs/chart'

const { Title } = Typography

const Agents = () => {
  const {
    activeAgentId,
    setActiveAgentId,
    getAgent,
    updateAgentConfig,
    getAgentConfig,
  } = useVeramo()
  const { id } = useParams<{ id: string }>()
  if (!id) throw Error('Agent id is missing')

  const agent = getAgent(id)
  const config = getAgentConfig(id)
  const [agentName, setAgentName] = useState<string>(agent?.context.name || '')

  const updateAgentName = (name: string) => {
    updateAgentConfig(agent.context.id as string, {
      ...config,
      context: { ...config.context, name },
    })

    setAgentName('')
  }

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
        </Layout>
      }
    >
      <Card
        title="Agent info"
        actions={[
          <Button
            icon={<PushpinOutlined />}
            disabled={activeAgentId === agent.context.id}
            onClick={() =>
              agent.context.id && setActiveAgentId(agent.context.id)
            }
          >
            Make Default
          </Button>,
        ]}
      >
        <Form labelCol={{ span: 10 }} wrapperCol={{ span: 30 }} layout="inline">
          <Form.Item label="Agent name">
            <Input
              type="text"
              onChange={(e) => setAgentName(e.target.value)}
              value={agentName}
            />
          </Form.Item>
          <Button onClick={() => updateAgentName(agentName)}>Update</Button>
        </Form>
      </Card>
    </Page>
  )
}

export default Agents
