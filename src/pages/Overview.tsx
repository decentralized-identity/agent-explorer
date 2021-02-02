import React from 'react'
import { Typography, Card, Layout } from 'antd'
import Page from '../layout/Page'
import { useVeramo } from '@veramo-community/veramo-react'
const { Title } = Typography

const Overview = () => {
  const { agent } = useVeramo()

  if (agent) {
    console.log(agent)
  }

  const rightContent = () => {
    return (
      <Layout>
        <Card title="Issuer">
          <p>Card content</p>
          <p>Card content</p>
        </Card>
        <Card title="Subject">
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
      <Card style={{ height: 400 }} loading>
        Card 1
      </Card>
      <Card style={{ height: 400 }} loading>
        Card 1
      </Card>
      <Card style={{ height: 400 }} loading>
        Card 1
      </Card>
      <Card style={{ height: 400 }} loading>
        Card 1
      </Card>
      <Card style={{ height: 400 }} loading>
        Card 1
      </Card>
      <Card style={{ height: 400 }} loading>
        Card 1
      </Card>
      <Card style={{ height: 400 }} loading>
        Card 1
      </Card>
      <Card style={{ height: 400 }} loading>
        Card 1
      </Card>
    </Page>
  )
}

export default Overview
