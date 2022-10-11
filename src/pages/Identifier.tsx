import React from 'react'
import { Typography, Card, Layout, Tabs } from 'antd'
import Page from '../layout/Page'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import IdentifierKeys from '../components/standard/IdentifierKeys'
import IdentifierServices from '../components/standard/IdentifierServices'
import IdentifierQuickSetup from '../components/standard/IdentifierQuickSetup'

const { Title } = Typography
const { TabPane } = Tabs

const Identifier = () => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw Error('id is missing')

  const { agent } = useVeramo()
  const { data: identifer, isLoading } = useQuery(['identifier', id], () =>
    agent?.resolveDid({ didUrl: id }),
  )
  const { data: managedDID } = useQuery(['managedDid', id], () =>
    agent?.didManagerGet({ did: id }),
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
            {managedDID && (
              <IdentifierQuickSetup
                title="Quick Setup"
                identifier={id}
                cacheKey={`identifier-quicksetup-${id}`}
              />
            )}
            <IdentifierKeys
              title="Keys"
              identifier={id}
              cacheKey={`identifier-keys-${id}`}
              isManaged={managedDID}
            />
            <IdentifierServices
              title="Services"
              identifier={id}
              cacheKey={`identifier-services-${id}`}
              isManaged={managedDID}
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
