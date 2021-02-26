import React from 'react'
import { Typography, Card, Layout } from 'antd'
import Page from '../layout/Page'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import IdentifierKeys from '../components/standard/Identifier'

const { Title } = Typography

const Identifier = () => {
  const { id } = useParams<{ id: string }>()
  const { agent } = useVeramo()
  const { data: identifer, isLoading } = useQuery(['identifier', id], () =>
    agent?.resolveDid({ didUrl: id }),
  )

  const rightContent = () => {
    return (
      <Layout>
        <IdentifierKeys title="Keys" identifier={id} cacheKey="identifier" />
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
    >
      <Card loading={isLoading} title={'DID Document'}>
        <pre>{JSON.stringify(identifer, null, 2)}</pre>
      </Card>
    </Page>
  )
}

export default Identifier
