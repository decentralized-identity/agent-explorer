import React from 'react'
import { Input, Button, App } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer, ProList } from '@ant-design/pro-components'
import { IDataStoreORM } from '@veramo/core'
import { CopyOutlined } from '@ant-design/icons'
import { IdentifierProfile } from '@veramo-community/agent-explorer-plugin'

const { Search } = Input

export const Contacts = () => {
  const { notification } = App.useApp()
  const { agent } = useVeramo<IDataStoreORM>()
  const navigate = useNavigate()

  const { data: identifiers, isLoading } = useQuery(
    ['contacts', { agentId: agent?.context.id }],
    () => agent?.dataStoreORMGetIdentifiers(),
  )

  return (
    <PageContainer>
      <Search
        placeholder="Resolve DID"
        onSearch={(value) => navigate('/contacts/' + value)}
        style={{ width: 400, marginBottom: 20 }}
      />
      {identifiers !== undefined && <ProList<{ title: string | undefined, id: string }>
        rowKey="id"
        ghost
        pagination={{
          pageSize: 15,
          showTitle: false,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        loading={isLoading}
        dataSource={identifiers && identifiers.map((identifier) => ({ 
          id: identifier.did || '',
          title: '',
          actions: [
            <Button
              key={'copy'}
              type="text"
              icon={<CopyOutlined />}
              title="Copy DID to clipboard"
              onClick={() => {
                navigator.clipboard.writeText(String(identifier.did))
                notification.success({
                  message: 'Copied identifier to clipboard',
                })
              }}
            />,
          ]
        }))}
        metas={{
          id:{},
          title: {
            render: (text, record) =>  <Link to={'/identifiers/' + encodeURIComponent(record.id)}>
            <IdentifierProfile did={record.id} />
          </Link>,
          },
          actions: {},
        }}
      />}
    </PageContainer>
  )
}

