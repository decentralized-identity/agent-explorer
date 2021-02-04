import React, { useState } from 'react'
import { Typography, Card, Button, Row, Space, Tag, Layout, Col } from 'antd'
import Page from '../layout/Page'
import { useVeramo } from '@veramo-community/veramo-react'
import { PushpinOutlined, DatabaseOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import Chart from '../components/simple/Chart'

const { Title, Text } = Typography

const data1 = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  fill: false,
  datasets: [
    {
      label: 'Activity',
      data: [500, 897, 234, 564, 765, 432],
      borderColor: 'rgb(47 89 138 / 80%)',
      fill: false,
      lineTension: 0,
      backgroundColor: 'rgb(47 89 138 / 20%)',
      borderWidth: 1,
    },
  ],
  options: {
    scales: {
      xAxes: [
        {
          display: false,
        },
      ],
      yAxes: [
        {
          display: false,
        },
      ],
    },
  },
}

const Agents = () => {
  const { id } = useParams<{ id: string }>()
  const { activeAgentId, setActiveAgentId, getAgent, agents } = useVeramo()
  const agent = getAgent(id)

  return (
    <Page
      rightContent={
        <Layout>
          <Card>
            <Chart type="line" data={data1}></Chart>
          </Card>
          <Card title="Query Composer">
            Options with current view populated to save for future queries
          </Card>
        </Layout>
      }
      header={
        <Layout>
          <Title style={{ fontWeight: 'bold' }}>{agent.context.name}</Title>
          <Row>
            {activeAgentId === agent.context.id && (
              <Tag color="geekblue">Default Agent</Tag>
            )}
            <Tag color="">Schema</Tag>
            <Tag color="">W3C</Tag>
          </Row>
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
      <Card title="Data Generator">
        <Row style={{ marginBottom: 20 }}>
          <Col>
            <Text>Generate dataset quickly using this module</Text>
            <ul style={{ paddingTop: 15 }}>
              <li>Create identites in bulk</li>
              <li>Create credentials in bulk</li>
              <li>Configure issuers and subjects</li>
              <li>Create messages between identifiers across agents</li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Space>
            <Button icon={<DatabaseOutlined />}>Yeah, sounds great</Button>
          </Space>
        </Row>
      </Card>
    </Page>
  )
}

export default Agents
