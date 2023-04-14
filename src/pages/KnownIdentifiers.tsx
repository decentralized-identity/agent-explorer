import React from 'react'
import { Table } from 'antd'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { PageContainer } from '@ant-design/pro-components'
import { shortId } from '../utils/did'

const columns = [
  {
    title: 'DID',
    dataIndex: 'did',
    key: 'did',
    render: (did: string) => (
      <Link to={'/identifier/' + encodeURIComponent(did)}>{shortId(did)}</Link>
    ),
  },
]

const KnownIdentifiers = () => {
  const { agent } = useVeramo()

  const { data: identifiers, isLoading } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.dataStoreORMGetIdentifiers(),
  )

  return (
    <PageContainer>
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
