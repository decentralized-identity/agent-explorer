import React from 'react'
import { Typography, Card, Layout } from 'antd'
import Page from '../layout/Page'
import { useVeramo } from '@veramo-community/veramo-react'
const { Title, Text } = Typography

const Overview = () => {
  const { agent } = useVeramo()

  if (agent) {
    console.log('Default Agent', agent)
  }

  const rightContent = () => {
    return (
      <Layout>
        <Card title="Side Module">
          <p>Card content</p>
          <p>Card content</p>
        </Card>
        <Card title="Side Module">
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </Layout>
    )
  }

  return (
    <Page
      header={<Title style={{ fontWeight: 'bold' }}>Overview</Title>}
      rightContent={rightContent()}
    >
      <Card>
        <Text>
          Nothing here yet. We need to surface some general data from the agent.
          Each block could be linked out to other sections.
        </Text>
      </Card>
      <Card style={{ height: 400 }} title="Viz 1">
        Visualisation, Time based eg Identifiers added over the past 12 months.
      </Card>
      <Card style={{ height: 400 }} title="Viz 2">
        Visualisation
      </Card>
      <Card style={{ height: 400 }} title="Identifiers"></Card>
      <Card style={{ height: 400 }} title="Credentials">
        Card 1
      </Card>
      <Card style={{ height: 400 }} title="Messages">
        Card 1
      </Card>
    </Page>
  )
}

export default Overview
