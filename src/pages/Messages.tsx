import React from 'react'
import { Typography, Table } from 'antd'
import Page from '../layout/Page'
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
]

const Messages = () => {
  return (
    <Page header={<Title style={{ fontWeight: 'bold' }}>Messages</Title>}>
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

export default Messages
