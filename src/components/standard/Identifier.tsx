import React, { useState } from 'react'
import { Button, Card, Input, List } from 'antd'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { LockOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import shortId from 'shortid'

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

  console.log(data)

  return (
    <Card title={title} style={{ flexWrap: 'wrap' }} loading={isLoading}>
      <List
        dataSource={
          data?.didDocument?.verificationMethod || data?.didDocument?.publicKey
        }
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
                description={item.type}
              />
            </List.Item>
          )
        }}
      ></List>
    </Card>
  )
}

export default Module
