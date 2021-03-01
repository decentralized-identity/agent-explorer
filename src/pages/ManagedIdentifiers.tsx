import React from 'react'
import { Typography, Table, Button } from 'antd'
import Page from '../layout/Page'
import { FundViewOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import ImportNft from '../components/modules/ImportNft'

const { Title } = Typography

const columns = [
  {
    title: 'DID',
    dataIndex: 'did',
    key: 'did',
    render: (did: string) => <Link to={'/identifier/' + did}>{did}</Link>,
  },
  {
    title: 'Provider',
    dataIndex: 'provider',
    key: 'provider',
    responsive: ['md'],
  },
  {
    title: 'Alias',
    dataIndex: 'alias',
    key: 'alias',
    responsive: ['lg'],
  },
  {
    title: 'Explore',
    width: 100,
    dataIndex: 'did',
    render: (did: string) => <Button icon={<FundViewOutlined />} />,
  },
]

const Identifiers = () => {
  const { agent } = useVeramo()
  const { data: identifiers, isLoading } = useQuery(
    ['managedIdentifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )
  return (
    <Page
      header={<Title style={{ fontWeight: 'bold' }}>Managed identifiers</Title>}
    >
      <Table
        loading={isLoading}
        rowKey={(record) => record.did as string}
        dataSource={identifiers}
        // @ts-ignore
        columns={columns}
      />
      <ImportNft />
    </Page>
  )
}

export default Identifiers
