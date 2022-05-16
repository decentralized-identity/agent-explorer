import React, { useState } from 'react'
import { Button, Card, Input, List } from 'antd'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { LockOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import shortId from 'shortid'
import { IKey } from '@veramo/core'

interface IdentifierModuleProps {
  title: string
  identifier: string
  cacheKey: any
}

interface ServiceEndpoint {
  id: string
  type: string
  serviceEndpoint: string
  description?: string
}

const Module: React.FC<IdentifierModuleProps> = ({
  title,
  identifier,
  cacheKey,
}) => {
  const { agent } = useVeramo()
  const [serviceId] = useState(shortId.generate())
  const [serviceType, setServiceType] = useState('Messaging')
  const [serviceEndpoint, setServiceEndpoint] = useState(
    'https://example.com/messaging',
  )
  const [serviceDescription, setServiceDescription] = useState('')

  const { data, isLoading } = useQuery(
    [cacheKey],
    () => agent?.resolveDid({ didUrl: identifier }),
    { enabled: !!identifier },
  )

  const { data: localVersion } = useQuery(
    [cacheKey + 'local'],
    () => agent?.didManagerGet({ did: identifier }),
    { enabled: !!identifier },
  )

  const addService = async () => {
    try {
      await agent?.didManagerAddService({
        did: identifier,
        service: {
          id: serviceId,
          type: serviceType,
          serviceEndpoint,
          description: serviceDescription,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  const removeService = async (service: ServiceEndpoint) => {
    try {
      await agent?.didManagerRemoveService({
        did: identifier,
        id: service.id,
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Card title={title} style={{ flexWrap: 'wrap' }} loading={isLoading}>
      <Card title="External">
        <Card title="Public keys">
          <List
            dataSource={data?.didDocument?.verificationMethod}
            renderItem={(item: any, i: number) => {
              return (
                <List.Item key={i}>
                  <List.Item.Meta
                    avatar={<LockOutlined />}
                    title={
                      <Link to={'/identifiers/' + item.controller}>
                        <code>{item.controller}</code>
                      </Link>
                    }
                    description={`${item.type}`}
                  />
                </List.Item>
              )
            }}
          ></List>
        </Card>

        <Card title="Services">
          <List
            dataSource={data?.didDocument?.service}
            renderItem={(item: ServiceEndpoint, i: number) => {
              return (
                <List.Item key={i}>
                  <List.Item.Meta
                    avatar={<LockOutlined />}
                    title={item.type + ': ' + item.serviceEndpoint}
                    description={item.id + ' ' + item.description}
                  />
                  <Button onClick={() => removeService(item)}>Delete</Button>
                </List.Item>
              )
            }}
          ></List>
        </Card>

        <Card title="Add service endpoint">
          <Input
            placeholder="Messaging"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          />

          <Input
            placeholder="https://example.com/messaging"
            value={serviceEndpoint}
            onChange={(e) => setServiceEndpoint(e.target.value)}
          />

          <Input
            placeholder="Handles incoming POST messages"
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
          />

          <Button onClick={() => addService()}>Add</Button>
        </Card>
        <Card title="JSON">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Card>
      </Card>

      <Card title="Local">
        <Card title="Public keys">
          <List
            dataSource={localVersion?.keys}
            renderItem={(item: IKey, i: number) => {
              return (
                <List.Item key={i}>
                  <List.Item.Meta
                    avatar={<LockOutlined />}
                    title={<code>{item.kid}</code>}
                    description={`${item.type}`}
                  />
                </List.Item>
              )
            }}
          ></List>
        </Card>

        <Card title="Services">
          <List
            dataSource={localVersion?.services}
            renderItem={(item: ServiceEndpoint, i: number) => {
              return (
                <List.Item key={i}>
                  <List.Item.Meta
                    avatar={<LockOutlined />}
                    title={item.type + ': ' + item.serviceEndpoint}
                    description={item.id + ' ' + item.description}
                  />
                </List.Item>
              )
            }}
          ></List>
        </Card>

        <Card title="JSON">
          <pre>{JSON.stringify(localVersion, null, 2)}</pre>
        </Card>
      </Card>
    </Card>
  )
}

export default Module
