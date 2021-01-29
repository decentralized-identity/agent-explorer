import React from 'react'
import { Typography, Table, Row, Tooltip, Tag } from 'antd'
import Page from '../layout/Page'
import messages from '../stubbs/messages'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

const { Title } = Typography

const expandedRowRender = (message: any) => {
  const columns = [
    {
      title: 'Credentials',
      dataIndex: 'credentialSubject',
      key: 'credentialSubject',
      render: (credentialSubject: any) => (
        <pre>{JSON.stringify(credentialSubject, null, 2)}</pre>
      ),
    },
    {
      title: 'Issuance Date',
      dataIndex: 'issuanceDate',
      key: 'issuanceDate',
      width: 150,
      render: (issuanceDate: string) =>
        format(new Date(issuanceDate), 'do MMM yyyy'),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: any) =>
        type.map((type: string, i: number) => <Tag key={i}>{type}</Tag>),
    },
  ]

  // return (
  //   message.credentials.length > 0 && (
  //     <>
  //       {message.credentials.map((credential: any) => {
  //         return (
  //           <Row>
  //             <pre>{JSON.stringify(credential.credentialSubject, null, 2)}</pre>
  //           </Row>
  //         )
  //       })}
  //     </>
  //   )
  // )

  return (
    <Table
      columns={columns}
      dataSource={message.credentials}
      pagination={false}
    />
  )
}

const columns = [
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    width: 150,
    render: (createdAt: string) => format(new Date(createdAt), 'do MMM yyyy'),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    width: 100,
  },
  {
    title: 'From',
    dataIndex: 'from',
    ellipsis: {
      showTitle: false,
    },
    render: (from: any) => (
      <Tooltip placement="topLeft" title={from}>
        <Link to={'/identifiers/' + from}>{from}</Link>
      </Tooltip>
    ),
  },
  {
    title: 'To',
    dataIndex: 'to',
    ellipsis: {
      showTitle: false,
    },
    responsive: ['lg'],
    render: (to: any) => (
      <Tooltip placement="topLeft" title={to}>
        <Link to={'/identifiers/' + to}>{to}</Link>
      </Tooltip>
    ),
  },
]

const Messages = () => {
  return (
    <Page header={<Title style={{ fontWeight: 'bold' }}>Messages</Title>}>
      <Table
        rowKey={(record) => record.id}
        dataSource={messages}
        expandable={{ expandedRowRender }}
        // @ts-ignore
        columns={columns}
      />
    </Page>
  )
}

export default Messages
