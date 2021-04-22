import React from 'react'
import {
  Typography,
  Table,
  Tooltip,
  Tag,
  List,
  Timeline,
  Card,
  Avatar,
} from 'antd'
import Page from '../layout/Page'
import { formatDistanceToNow, format } from 'date-fns'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { MailOutlined } from '@ant-design/icons'
import md5 from 'md5'

const { Title } = Typography
const GRAVATAR_URI = 'https://www.gravatar.com/avatar/'

// const expandedRowRender = (message: any) => {
//   const columns = [
//     {
//       title: 'Credentials',
//       dataIndex: 'credentialSubject',
//       key: 'credentialSubject',
//       render: (credentialSubject: any) => (
//         <pre>{JSON.stringify(credentialSubject, null, 2)}</pre>
//       ),
//     },
//     {
//       title: 'Issuance Date',
//       dataIndex: 'issuanceDate',
//       key: 'issuanceDate',
//       width: 150,
//       render: (issuanceDate: string) =>
//         format(new Date(issuanceDate), 'do MMM yyyy'),
//     },
//     {
//       title: 'Type',
//       dataIndex: 'type',
//       key: 'type',
//       width: 100,
//       render: (type: any) =>
//         type.map((type: string, i: number) => <Tag key={i}>{type}</Tag>),
//     },
//   ]

//   return (
//     <Table
//       columns={columns}
//       dataSource={message.credentials}
//       pagination={false}
//     />
//   )
// }

// const columns = [
//   {
//     title: 'Created At',
//     dataIndex: 'createdAt',
//     width: 150,
//     render: (createdAt: string) => format(new Date(createdAt), 'do MMM yyyy'),
//   },
//   {
//     title: 'Type',
//     dataIndex: 'type',
//     width: 100,
//   },
//   {
//     title: 'From',
//     dataIndex: 'from',
//     ellipsis: {
//       showTitle: false,
//     },
//     render: (from: any) => (
//       <Tooltip placement="topLeft" title={from}>
//         <Link to={'/identifier/' + from}>{from}</Link>
//       </Tooltip>
//     ),
//   },
//   {
//     title: 'To',
//     dataIndex: 'to',
//     ellipsis: {
//       showTitle: false,
//     },
//     responsive: ['lg'],
//     render: (to: any) => (
//       <Tooltip placement="topLeft" title={to}>
//         <Link to={'/identifier/' + to}>{to}</Link>
//       </Tooltip>
//     ),
//   },
// ]

const messageType = (type: string) => {
  switch (type) {
    case 'w3c.vc':
      return 'Verifiable Credential'
    case 'w3c.vp':
      return 'Verifiable Presentation'
    case 'sdr':
      return 'Selective Disclosure Request'
  }
}

const Messages = () => {
  const { agent } = useVeramo()
  const { data: messages } = useQuery(
    ['messages', { agentId: agent?.context.name }],
    () => agent?.dataStoreORMGetMessages(),
  )

  const uri = (did: string) => {
    return GRAVATAR_URI + md5(did) + '?s=200&d=retro'
  }

  console.log(messages)

  return (
    <Page header={<Title style={{ fontWeight: 'bold' }}>Activity</Title>}>
      <List
        dataSource={messages}
        renderItem={(item, index) => (
          <Card key={index}>
            <Card.Meta
              avatar={<Avatar size="large" src={uri(item.from || '')} />}
              title={item.from}
              description={
                formatDistanceToNow(new Date(item.createdAt as string)) + ' ago'
              }
            ></Card.Meta>
            {item?.credentials &&
              item?.credentials.map((vc) => {
                return (
                  <Card style={{ marginTop: 20 }} title="Verifiable Credential">
                    <Card.Meta
                      style={{ marginBottom: 15 }}
                      title="Credential Type"
                      description={vc.type.map((type) => (
                        <Tag color="geekblue">{type}</Tag>
                      ))}
                    ></Card.Meta>
                    <Card.Meta
                      style={{ marginBottom: 15 }}
                      title="Issuance Date"
                      description={format(
                        new Date(vc.issuanceDate),
                        'do MMM yyyy',
                      )}
                    ></Card.Meta>
                    <Card.Meta
                      style={{ marginBottom: 15 }}
                      title="Issuer"
                      description={vc.issuer.id}
                    ></Card.Meta>
                    <Card.Meta
                      style={{ marginBottom: 15 }}
                      title="Subject"
                      description={vc.credentialSubject.id}
                    ></Card.Meta>
                    <Card.Meta
                      style={{ marginBottom: 15 }}
                      title="Proof Type"
                      description={vc.proof.type}
                    ></Card.Meta>
                    <Card.Meta
                      style={{ marginBottom: 15 }}
                      title="Credential Subject"
                      description={
                        <code>
                          <pre>
                            {JSON.stringify(vc.credentialSubject, null, 2)}
                          </pre>
                        </code>
                      }
                    ></Card.Meta>
                  </Card>
                )
              })}
          </Card>
        )}
      ></List>
    </Page>
  )
}

export default Messages
