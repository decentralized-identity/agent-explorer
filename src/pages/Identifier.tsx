import React from 'react'
import { Typography, Card, Layout, Tabs } from 'antd'
import Page from '../layout/Page'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDManager, IResolver } from '@veramo/core'
import IdentifierKeys from '../components/standard/IdentifierKeys'
import IdentifierServices from '../components/standard/IdentifierServices'
import IdentifierQuickSetup from '../components/standard/IdentifierQuickSetup'
import IdentifierReceivedCredentials from '../components/standard/IdentifierReceivedCredentials'
import IdentifierIssuedCredentials from '../components/standard/IdentifierIssuedCredentials'

const { Title } = Typography
const { TabPane } = Tabs

const Identifier = () => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw Error('id is missing')

  const { agent } = useVeramo<IDIDManager & IResolver>()
  const { data: resolutionResult, isLoading } = useQuery(
    ['identifier', id],
    () => agent?.resolveDid({ didUrl: id }),
  )
  const { data: managedDID } = useQuery(['managedDid', id], () =>
    agent?.didManagerGet({ did: id }),
  )

  const isManaged = !!managedDID?.provider
  // const hasDIDCommSetup = !!resolutionResult?.didDocument?.service?.find(
  //   (s) => s.type === 'DIDCommMessaging',
  // )
  const resolved = resolutionResult?.didResolutionMetadata.error === undefined

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
        <TabPane tab="Credentials" key="0">
          <IdentifierReceivedCredentials identifier={id} />
          <IdentifierIssuedCredentials identifier={id} />
        </TabPane>
        {resolved && (
          <TabPane tab="DID Document" key="1">
            <Layout>
              {isManaged && (
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
                isManaged={isManaged}
              />
              <IdentifierServices
                title="Services"
                identifier={id}
                cacheKey={`identifier-services-${id}`}
                isManaged={isManaged}
              />
            </Layout>
          </TabPane>
        )}
        <TabPane tab="Resolution Result" key="2">
          <Card loading={isLoading} size="small">
            <pre>{JSON.stringify(resolutionResult, null, 2)}</pre>
          </Card>
        </TabPane>
      </Tabs>
    </Page>
  )
}

export default Identifier
