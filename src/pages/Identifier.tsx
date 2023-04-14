import React, { useState } from 'react'
import { Button, Card, Layout, Tabs } from 'antd'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDManager, IResolver } from '@veramo/core'
import IdentifierKeys from '../components/standard/IdentifierKeys'
import IdentifierServices from '../components/standard/IdentifierServices'
import IdentifierQuickSetup from '../components/standard/IdentifierQuickSetup'
import IdentifierReceivedCredentials from '../components/standard/IdentifierReceivedCredentials'
import IdentifierIssuedCredentials from '../components/standard/IdentifierIssuedCredentials'
import { PageContainer } from '@ant-design/pro-components'
import { shortId } from '../utils/did'
import { CopyOutlined } from '@ant-design/icons'

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

  const hasDIDCommSetup =
    !!managedDID?.services?.find((s) => s.type === 'DIDCommMessaging') &&
    !!managedDID?.keys?.find(
      (key) => key.type === 'X25519' || key.type === 'Ed25519',
    )

  const resolved = resolutionResult?.didResolutionMetadata.error === undefined

  return (
    <PageContainer
      title={shortId(id)}
      extra={[
        <Button
          icon={<CopyOutlined />}
          title="Copy DID to clipboard"
          onClick={() => navigator.clipboard.writeText(id)}
        />,
      ]}
    >
      <Tabs>
        <TabPane tab="Credentials" key="0">
          <IdentifierReceivedCredentials identifier={id} />
          <IdentifierIssuedCredentials identifier={id} />
        </TabPane>
        {resolved && (
          <TabPane tab="DID Document" key="1">
            <Layout>
              {!hasDIDCommSetup && (
                <IdentifierQuickSetup
                  title="DIDComm mediator setup"
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
    </PageContainer>
  )
}

export default Identifier
