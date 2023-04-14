import React from 'react'
import { Table, Input, Button, Space } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer } from '@ant-design/pro-components'
import { shortId } from '../utils/did'
import { IIdentifier } from '@veramo/core'
import { CopyOutlined } from '@ant-design/icons'

const { Search } = Input

const KnownIdentifiers = () => {
  const { agent } = useVeramo()
  const navigate = useNavigate()

  const { data: identifiers, isLoading } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.dataStoreORMGetIdentifiers(),
  )

  const columns = [
    {
      title: 'DID',
      dataIndex: 'did',
      key: 'did',
      render: (did: string) => (
        <Link to={'/identifier/' + encodeURIComponent(did)}>
          {shortId(did)}
        </Link>
      ),
    },
    {
      title: 'Actions',
      key: 'did',
      render: (did: IIdentifier) => (
        <Button
          key={'copy'}
          icon={<CopyOutlined />}
          title="Copy DID to clipboard"
          onClick={() => navigator.clipboard.writeText(did.did)}
        />
      ),
    },
  ]

  return (
    <PageContainer>
      <Search
        placeholder="Resolve DID"
        onSearch={(value) => navigate('/identifier/' + value)}
        style={{ width: 400, marginBottom: 20 }}
      />
      <Table
        loading={isLoading}
        rowKey={(record) => record.did as string}
        dataSource={identifiers}
        // @ts-ignore
        columns={columns}
      />
    </PageContainer>
  )
}

export default KnownIdentifiers
