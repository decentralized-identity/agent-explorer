import React from 'react'
import { Typography, Table, Button } from 'antd'
import Page from '../layout/Page'
import { FundViewOutlined } from '@ant-design/icons'
import identifiers from '../stubbs/identifiers'

const { Title } = Typography

const columns = [
  {
    title: 'DID',
    dataIndex: 'did',
    key: 'did',
    render: (text: string) => <a>{text}</a>,
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
  return (
    <Page header={<Title style={{ fontWeight: 'bold' }}>Identifiers</Title>}>
      <Table
        rowKey={(record) => record.did}
        dataSource={identifiers}
        // bordered
        // @ts-ignore
        columns={columns}
      />
    </Page>
  )
}

export default Identifiers
