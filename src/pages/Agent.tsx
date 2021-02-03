import React from 'react'
import { Typography, Card, Layout } from 'antd'
import Page from '../layout/Page'

const { Title } = Typography

const Agent = () => {
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
      header={<Title style={{ fontWeight: 'bold' }}>Agent</Title>}
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

export default Agent
