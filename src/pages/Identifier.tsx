import React from 'react'
import { Typography, Card, Layout, Tabs } from 'antd'
import Page from '../layout/Page'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import IdentifierKeys from '../components/standard/IdentifierKeys'
import IdentifierServices from '../components/standard/IdentifierServices'

const { Title } = Typography
const { TabPane } = Tabs

const Identifier = () => {
  const { id } = useParams<{ id: string }>()
  const { agent } = useVeramo()
  const { data: identifer, isLoading } = useQuery(['identifier', id], () =>
    agent?.resolveDid({ didUrl: id }),
  )

  return (
    <Page
      header={
        <Layout>
          <Title style={{ fontWeight: 'bold' }}>Identifier</Title>
          <code>{id}</code>
        </Layout>
      }
    >
      <Tabs>
        <TabPane tab="Fields" key="1">
          <Layout>
            <IdentifierKeys
              title="Keys"
              identifier={id}
              cacheKey="identifier"
            />
            <IdentifierServices
              title="Services"
              identifier={id}
              cacheKey="identifier"
            />
          </Layout>
        </TabPane>
        <TabPane tab="JSON Source" key="2">
          <Card loading={isLoading} title={'DID Document'}>
            <pre>{JSON.stringify(identifer, null, 2)}</pre>
          </Card>
        </TabPane>
      </Tabs>
    </Page>
  )
}

export default Identifier
