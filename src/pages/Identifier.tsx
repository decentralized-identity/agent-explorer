import React from 'react'
import { Typography, Card, Layout } from 'antd'
import Page from '../layout/Page'
import { useParams } from 'react-router-dom'
import DidDoc from '../components/modules/Identifier'

const { Title } = Typography

const Identifier = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <Page
      header={
        <Layout>
          <Title style={{ fontWeight: 'bold' }}>Identifier</Title>
          <code>{id}</code>
        </Layout>
      }
    >
      <DidDoc identifier={id} cacheKey="aaa" title="DID Document" />
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
