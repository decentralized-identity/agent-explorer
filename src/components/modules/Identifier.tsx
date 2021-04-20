import React from 'react'
import { Card, List } from 'antd'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { LockOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

interface IdentifierModuleProps {
  title: string
  identifier: string
  cacheKey: any
}

const Module: React.FC<IdentifierModuleProps> = ({
  title,
  identifier,
  cacheKey,
}) => {
  const { agent } = useVeramo()
  const { data, isLoading } = useQuery(
    [cacheKey],
    () => agent?.resolveDid({ didUrl: identifier }),
    { enabled: !!identifier },
  )

  console.log(data)

  return (
    <Card title={title} style={{ flexWrap: 'wrap' }} loading={isLoading}>
      <List
        //@ts-ignore
        dataSource={data?.didDocument.verificationMethod}
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
