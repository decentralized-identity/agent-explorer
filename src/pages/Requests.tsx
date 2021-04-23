import React from 'react'
import { Typography, Tag, List, Card, Avatar } from 'antd'
import Page from '../layout/Page'
import { formatDistanceToNow, format } from 'date-fns'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import md5 from 'md5'
import CreateRequest from '../components/standard/CreateRequest'

const { Title } = Typography
const GRAVATAR_URI = 'https://www.gravatar.com/avatar/'

const Requests = () => {
  const uri = (did: string) => {
    return GRAVATAR_URI + md5(did) + '?s=200&d=retro'
  }
  const { agent } = useVeramo()
  const { data: messages } = useQuery(
    ['requests', { agentId: agent?.context.name }],
    () =>
      agent?.dataStoreORMGetMessages({
        where: [{ column: 'type', value: ['sdr'] }],
        order: [{ column: 'createdAt', direction: 'DESC' }],
      }),
  )
  const { data: managedIdentifiers } = useQuery(
    ['managed-identifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )

  const isManaged = (did: string) => {
    return managedIdentifiers?.find((i) => i.did === did)
  }

  return (
    <Page
      header={<Title style={{ fontWeight: 'bold' }}>Requests</Title>}
      rightContent={<Card></Card>}
    >
      <CreateRequest />

      <List
        dataSource={messages}
        renderItem={(item, index) => (
          <Card key={index}>
            <Card.Meta
              avatar={<Avatar size="large" src={uri(item.from || '')} />}
              title={item.from}
              description={
                isManaged(item.from || '')
                  ? 'Created an SDR request '
                  : 'Received an SDR request ' +
                    formatDistanceToNow(new Date(item.createdAt as string)) +
                    ' ago'
              }
            ></Card.Meta>
            {item?.credentials &&
              item?.credentials.map((vc) => {
                return (
                  <Card style={{ marginTop: 20 }} title="Verifiable Credential">
                    <Card.Meta
                      style={{ marginBottom: 15 }}
                      title="Issuer"
                      description={vc.issuer.id}
                      avatar={
                        <Avatar size="large" src={uri(vc.issuer.id || '')} />
                      }
                    ></Card.Meta>
                    <div style={{ marginLeft: 55 }}>
                      <Card.Meta
                        style={{ marginBottom: 15 }}
                        title="Subject"
                        description={
                          <code>
                            <pre>
                              {JSON.stringify(vc.credentialSubject, null, 2)}
                            </pre>
                          </code>
                        }
                      ></Card.Meta>
                      <Card.Meta
                        style={{ marginBottom: 15 }}
                        title="Issuance Date"
                        description={format(
                          new Date(vc.issuanceDate),
                          'do MMM yyyy',
                        )}
                      ></Card.Meta>
                      <Card.Meta
                        style={{ marginBottom: 15 }}
                        title="Credential Type"
                        description={vc.type.map((type) => (
                          <Tag color="geekblue">{type}</Tag>
                        ))}
                      ></Card.Meta>
                      <Card.Meta
                        style={{ marginBottom: 15 }}
                        title="Proof Type"
                        description={<Tag color="green">{vc.proof.type}</Tag>}
                      ></Card.Meta>
                    </div>
                  </Card>
                )
              })}
          </Card>
        )}
      ></List>
    </Page>
  )
}

export default Requests
