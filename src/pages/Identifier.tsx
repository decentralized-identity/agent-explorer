import React from 'react'
import { Typography, Card, Layout } from 'antd'
import Page from '../layout/Page'
import { useParams } from 'react-router-dom'

const { Title } = Typography

const Identifier = () => {
  const { id } = useParams<{ id: string }>()

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
      header={
        <Layout>
          <Title style={{ fontWeight: 'bold' }}>Identifier</Title>
          <code>{id}</code>
        </Layout>
      }
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

export default Identifier
